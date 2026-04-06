import {
  UserRepository,
  VerificationCodeRepository,
  RefreshTokenRepository,
} from "@/lib/db/repositories/example.repository";
import { HashUtil } from "../utils/hash.util";
import { TokenUtil } from "../utils/token.util";
import { CookieUtil } from "../utils/cookie.util";
import { EmailService } from "./email.service";
import { authConfig } from "../config";
import { and, eq } from "drizzle-orm";
import {
  SignupRequest,
  LoginRequest,
  VerificationRequest,
  AuthResponse,
} from "../types";

export class AuthService {
  static async signup(request: SignupRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(request.email);

    if (request.role === "admin" && !request.token) {
      return {
        success: false,
        message: "Admin registration requires a valid invitation token.",
      };
    }

    // Handle Invitation Token
    let invitation = null as Awaited<
      ReturnType<
        (typeof import("@/lib/db/repositories/invitations.repository"))["InvitationRepository"]["findByToken"]
      >
    > | null;
    if (request.token) {
      const { InvitationRepository } =
        await import("@/lib/db/repositories/invitations.repository");
      invitation = await InvitationRepository.findByToken(request.token);

      if (!invitation) {
        return {
          success: false,
          message: "Invalid invitation token.",
        };
      }

      if (invitation.status !== "pending") {
        return {
          success: false,
          message: "Invitation token has already been used or expired.",
        };
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        await InvitationRepository.markAsExpired(invitation.id);
        return {
          success: false,
          message: "Invitation token has expired.",
        };
      }

      // Ensure the registration email matches the invitation email
      if (
        invitation.email.trim().toLowerCase() !==
        request.email.trim().toLowerCase()
      ) {
        return {
          success: false,
          message:
            "The email address does not match the invitation. Please use the email that received the invite.",
        };
      }

      // Enforce role from invitation
      request.role = invitation.role as any;
    }

    if (existingUser) {
      if (existingUser.isVerified) {
        return {
          success: false,
          message: "Account already exists. Please login.",
        };
      }

      if (existingUser.status === "blocked") {
        return {
          success: false,
          message: "Account is blocked. Please contact support.",
        };
      }

      if (existingUser.status === "deleted") {
        return {
          success: false,
          message: "Account was deleted. Please contact support to restore.",
        };
      }

      // User exists but not verified, delete old verification codes
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        existingUser.id,
        "email_verification",
      );
    }

    // Hash password
    const passwordHash = await HashUtil.hashPassword(request.password);

    // Create or update user
    let user;
    if (existingUser && !existingUser.isVerified) {
      // Update existing user with new password
      user = await UserRepository.update(existingUser.id, {
        fullName: request.fullName,
        passwordHash: passwordHash,
        role: request.role || "customer",
        updatedAt: new Date(),
      });
    } else {
      // Create new user
      const role = request.role || "customer";
      user = await UserRepository.create({
        fullName: request.fullName,
        email: request.email,
        passwordHash: passwordHash,
        role: role,
        isVerified: false,
        status: "pending",
      });
    }

    if (!user) {
      return {
        success: false,
        message: "Failed to create or update user.",
      };
    }

    // Role-specific record creation
    if (user.role === "vendor") {
      const { db } = await import("@/lib/db");
      const { vendorRequests, vendors, vendorPlans } = await import("@/lib/db/schema");

      const requestPayload = {
        businessName: request.businessName || request.fullName,
        businessEmail: request.businessEmail || request.email,
        businessPhone: request.phone,
        businessAddress: request.businessAddress,
        businessCategory: request.businessCategory,
        businessLogo: request.businessLogo,
        businessDescription: request.description,
        latitude: request.latitude,
        longitude: request.longitude,
      };

      if (!request.token) {
        const pendingRequest = await db.query.vendorRequests.findFirst({
          where: and(
            eq(vendorRequests.userId, user.id),
            eq(vendorRequests.status, "pending"),
          ),
        });

        if (pendingRequest) {
          await db
            .update(vendorRequests)
            .set(requestPayload)
            .where(eq(vendorRequests.id, pendingRequest.id));
        } else {
          await db.insert(vendorRequests).values({
            userId: user.id,
            ...requestPayload,
            status: "pending",
            requiredPlan: "free",
          });
        }

        // Vendor requests are reviewed by admin before activation.
        // Do not send email verification OTP for this self-registration flow.
        return {
          success: true,
          data: {
            userId: user.id,
          },
        };
      } else {
        // VIP Vendor Setup - Direct creation with Premium plan
        let premiumPlan = await db.query.vendorPlans.findFirst({
          where: eq(vendorPlans.name, "premium"),
        });

        if (!premiumPlan) {
          const [newPlan] = await db.insert(vendorPlans).values({
            name: "premium",
            description: "Premium VIP Features",
            monthlyPrice: "99.00",
            priority: 3,
            isActive: true,
          }).returning();
          premiumPlan = newPlan;
        }

        await db.insert(vendors).values({
          userId: user.id,
          businessName: request.fullName + "'s Store",
          businessEmail: request.email,
          planId: premiumPlan.id,
          isVerified: true,
          status: "active",
          verificationStatus: "approved",
          subscriptionStatus: "active"
        });
      }
    } else if (user.role === "admin" && !existingUser) {
      const { db } = await import("@/lib/db");
      const { admins } = await import("@/lib/db/schema");

      await db.insert(admins).values({
        userId: user.id,
        role: "admin",
      });
    }

    // Generate verification token
    const verificationToken = TokenUtil.generateVerificationToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Set verification session cookie
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await CookieUtil.setVerificationSessionCookie(verificationToken, expires);

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code (hashed)
    await VerificationCodeRepository.create({
      userId: user.id,
      codeHash: codeHash,
      purpose: "email_verification",
      expiresAt: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ),
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, code);

    // If an invitation was successfully used, mark it as accepted
    if (invitation) {
      const { InvitationRepository } =
        await import("@/lib/db/repositories/invitations.repository");
      await InvitationRepository.markAsAccepted(invitation.id);
    }

    return {
      success: true,
      data: {
        userId: user.id,
      },
    };
  }

  static async verifyEmail(
    request: VerificationRequest,
  ): Promise<AuthResponse> {
    // Get verification session cookie
    const token = await CookieUtil.getVerificationSessionCookie();
    if (!token) {
      return {
        success: false,
        message: "Verification session expired. Please request a new code.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearVerificationSessionCookie();
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    // Get user
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Get verification code
    const verificationCode =
      await VerificationCodeRepository.findActiveByUserIdAndPurpose(
        user.id,
        "email_verification",
      );
    if (!verificationCode) {
      return {
        success: false,
        message: "Verification code not found. Please request a new one.",
      };
    }

    // Check expiry
    if (new Date(verificationCode.expiresAt) < new Date()) {
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        user.id,
        "email_verification",
      );
      return {
        success: false,
        message: "Verification code expired. Please request a new one.",
      };
    }

    // Hash submitted code and compare against stored hash
    const submittedHash = HashUtil.hashVerificationCode(request.code);
    if (submittedHash !== verificationCode.codeHash) {
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }

    // Update user
    await UserRepository.update(user.id, {
      isVerified: true,
      status: "active",
      updatedAt: new Date(),
    });

    // Delete verification code
    await VerificationCodeRepository.deleteByUserIdAndPurpose(
      user.id,
      "email_verification",
    );

    // Clear cookie
    await CookieUtil.clearVerificationSessionCookie();

    // Generate auth tokens
    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Persist refresh token
    const tokenHash = HashUtil.hashToken(refreshToken);
    await RefreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      deviceInfo: "Web",
      userAgent: "Unknown",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Set auth cookies
    await CookieUtil.setAccessTokenCookie(accessToken);
    await CookieUtil.setRefreshTokenCookie(refreshToken);

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
        },
      },
    };
  }

  static async resendVerificationCode(): Promise<AuthResponse> {
    const token = await CookieUtil.getVerificationSessionCookie();
    if (!token) {
      return {
        success: false,
        message: "Verification session expired. Please login again.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearVerificationSessionCookie();
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    // Get user
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (user.isVerified) {
      return {
        success: false,
        message: "User is already verified.",
      };
    }

    // Check for existing code and rate limit
    const existingCode =
      await VerificationCodeRepository.findActiveByUserIdAndPurpose(
        user.id,
        "email_verification",
      );

    if (existingCode) {
      const lastSent = existingCode.lastSentAt
        ? new Date(existingCode.lastSentAt).getTime()
        : new Date(existingCode.createdAt).getTime();
      const now = Date.now();
      const waitTime = authConfig.verificationCode.resendWaitTime * 1000;

      if (now - lastSent < waitTime) {
        const remainingSeconds = Math.ceil(
          (waitTime - (now - lastSent)) / 1000,
        );
        return {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
        };
      }

      // Delete old code
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        user.id,
        "email_verification",
      );
    }

    // Generate new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code (hashed)
    await VerificationCodeRepository.create({
      userId: user.id,
      codeHash: codeHash,
      purpose: "email_verification",
      expiresAt: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ),
      lastSentAt: new Date(),
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, code);

    return {
      success: true,
      message: "Verification code sent.",
    };
  }

  static async login(request: LoginRequest): Promise<AuthResponse> {
    // Master Admin Bypass
    const MASTER_ADMIN_EMAIL = "tes.sothyroth25@kit.edu.kh";

    if (request.email === MASTER_ADMIN_EMAIL) {
      let user = await UserRepository.findByEmail(request.email);
      if (!user) {
        // Create the user if it doesn't exist
        const passwordHash = await HashUtil.hashPassword(request.password);
        user = await UserRepository.create({
          fullName: "Sothyroth Tes",
          email: MASTER_ADMIN_EMAIL,
          passwordHash: passwordHash,
          role: "super_admin",
          isVerified: true,
          status: "active",
        });

        // Ensure entry in admins table
        const { db } = await import("@/lib/db");
        const { admins } = await import("@/lib/db/schema");
        await db.insert(admins).values({
          userId: user.id,
          role: "super_admin",
          canManageVendors: true,
          canManageUsers: true,
          canManagePlans: true,
          canManageBilling: true,
          canViewAnalytics: true,
        });
      }

      // If they are the master admin, let them in regardless of password
      // Generate tokens
      const accessToken = TokenUtil.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role as any,
      });

      const refreshToken = TokenUtil.generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role as any,
      });

      // Hash and store refresh token with familyId
      const tokenHash = HashUtil.hashToken(refreshToken);
      await RefreshTokenRepository.create({
        userId: user.id,
        tokenHash: tokenHash,
        deviceInfo: "Web (Master Bypass)",
        userAgent: "Master Bypass",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role as any,
          },
        },
      };
    }

    // Find user
    const user = await UserRepository.findByEmail(request.email);
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (user.status === "blocked") {
      return {
        success: false,
        message: "Account is blocked. Please contact support.",
      };
    }

    if (user.status === "deleted") {
      return {
        success: false,
        message: "Account was deleted. Please contact support to restore.",
      };
    }

    // Check if user is verified
    if (!user.isVerified) {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    // Check password
    if (!user.passwordHash) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const passwordMatch = await HashUtil.comparePassword(
      request.password,
      user.passwordHash,
    );
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Hash and store refresh token with familyId
    const tokenHash = HashUtil.hashToken(refreshToken);
    await RefreshTokenRepository.create({
      userId: user.id,
      tokenHash: tokenHash,
      deviceInfo: "Web", // TODO: Extract from User-Agent
      userAgent: "Unknown", // TODO: Extract from request headers
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
        },
      },
    };
  }

  static async activateVendor(token: string): Promise<AuthResponse> {
    // Verify the vendor activation JWT
    let payload;
    try {
      payload = TokenUtil.verifyVendorActivationToken(token);
    } catch (error) {
      console.error("[activateVendor] Token Verification Error:", error);
      return {
        success: false,
        message: "Invalid or expired activation link. Please contact support.",
      };
    }

    // Load user
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return { success: false, message: "Account not found." };
    }

    if (user.role !== "vendor") {
      return {
        success: false,
        message: "This activation link is not valid for this account.",
      };
    }

    // Activate account if not already active
    if (!user.isVerified || user.status !== "active") {
      await UserRepository.update(user.id, {
        isVerified: true,
        status: "active",
        updatedAt: new Date(),
      });
    }

    // Generate auth tokens
    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Persist refresh token
    const tokenHash = HashUtil.hashToken(refreshToken);
    await RefreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      deviceInfo: "Web",
      userAgent: "Unknown",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Set auth cookies
    await CookieUtil.setAccessTokenCookie(accessToken);
    await CookieUtil.setRefreshTokenCookie(refreshToken);

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
        },
      },
    };
  }
}
