class AuthClient {
  private baseUrl = "/api/auth";

  private async jsonRequest<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    return response.json();
  }

  async signup(data: {
    email: string;
    fullName: string;
    password: string;
    role?: string;
    businessName?: string;
    businessEmail?: string;
    phone?: string;
    businessAddress?: string;
    description?: string;
    token?: string;
  }) {
    return this.jsonRequest("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.jsonRequest("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(code: string) {
    return this.jsonRequest("/verify/email", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async resendVerificationCode() {
    return this.jsonRequest("/verify/resend", {
      method: "POST",
    });
  }

  async refreshToken() {
    return this.jsonRequest("/tokens/refresh", {
      method: "POST",
    });
  }

  async requestPasswordReset(email: string) {
    return this.jsonRequest("/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetCode(code: string) {
    return this.jsonRequest("/password/verify-code", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async resetPassword(newPassword: string, confirmPassword: string) {
    return this.jsonRequest("/password/reset", {
      method: "POST",
      body: JSON.stringify({ newPassword, confirmPassword }),
    });
  }
  async logout() {
    return this.jsonRequest("/logout", {
      method: "POST",
    });
  }

  async getProfile() {
    return this.jsonRequest("/profile", {
      method: "GET",
    });
  }

  async getSessions() {
    return this.jsonRequest("/sessions/list", {
      method: "GET",
    });
  }

  async logoutAllSessions() {
    return this.jsonRequest("/sessions/logout", {
      method: "POST",
    });
  }

  async revokeSession(sessionId: string) {
    return this.jsonRequest(`/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }
}

export const authClient = new AuthClient();
