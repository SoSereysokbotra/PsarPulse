import type { Metadata } from "next";
import { Outfit, Suwannaphum } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ServiceWorkerProvider } from "@/components/pwa/ServiceWorkerProvider";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

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
      <head>
        <meta name="theme-color" content="#29B28D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${outfit.variable} ${suwannaphum.variable} antialiased font-sans`}
      >
        <ServiceWorkerProvider>
          <ThemeProvider>
            <LanguageProvider>
              <OfflineIndicator />
              {children}
              <InstallPrompt />
            </LanguageProvider>
          </ThemeProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
