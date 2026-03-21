import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

interface AuthLayoutProps {
  children: ReactNode;
  leftContent: ReactNode;
  showBack?: boolean;
  backHref?: string;
  showLangToggle?: boolean;
}

export const AuthLayout = ({
  children,
  leftContent,
  showBack = true,
  backHref = "/",
  showLangToggle = false,
}: AuthLayoutProps) => {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row font-sans transition-colors duration-500 ${isDark ? "bg-dark-bg text-white" : "bg-psar-white"} selection:bg-psar-primary selection:text-white`}>
      {/* Left Panel */}
      <div className={`hidden lg:flex lg:w-5/12 ${isDark ? "bg-black" : "bg-psar-dark"} relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white border-r-4 border-psar-primary shadow-2xl z-10 transition-colors duration-500`}>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-psar-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-psar-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-10" />
        {leftContent}
      </div>

      {/* Right Panel */}
      <div className={`flex-1 flex flex-col justify-center relative ${isDark ? "bg-dark-bg" : "bg-psar-white"} py-12 px-6 sm:px-12 lg:px-20 xl:px-32 transition-colors duration-500`}>
        {/* Top navigation */}
        <div className="absolute top-8 left-6 right-6 lg:left-12 lg:right-12 flex justify-between items-center">
          {showBack && (
            <Link
              href={backHref}
              className={`${isDark ? "text-[#8A8F98] hover:text-white" : "text-slate-400 hover:text-slate-900"} transition-colors flex items-center font-bold ${isKhmer ? "font-suwannaphum" : ""}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> {t("auth.back")}
            </Link>
          )}
          {showLangToggle && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold shadow-sm text-xs">
                EN
              </button>
              <button className="px-4 py-2 text-slate-500 font-khmer text-xs">
                ខ្មែរ
              </button>
            </div>
          )}
        </div>

        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
};
