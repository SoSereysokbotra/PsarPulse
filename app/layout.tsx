import type { Metadata } from "next";
import { Outfit, Suwannaphum } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { UserProvider } from "@/components/providers/UserProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const suwannaphum = Suwannaphum({
  variable: "--font-suwannaphum",
  subsets: ["khmer"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "PsarPulse KH — Smart Analytics for Cambodian Night Markets",
  description:
    "Data-driven analytics and AI forecasting built exclusively for Cambodia's informal economy. Log sales, track growth, and get AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${suwannaphum.variable} antialiased font-sans`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
