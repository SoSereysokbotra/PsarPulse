import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export const SuccessCard = ({
  title,
  message,
  buttonText,
  buttonHref,
}: {
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="text-center animate-in fade-in zoom-in duration-500">
      <div className={`w-20 h-20 ${isDark ? "bg-[#29B28D]/20" : "bg-[#29B28D]/10"} rounded-full flex items-center justify-center mx-auto mb-6`}>
        <CheckCircle2 className="w-10 h-10 text-[#29B28D]" />
      </div>
      <h2 className={`text-3xl font-extrabold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
      <p className={`font-medium mb-8 ${isDark ? "text-[#8A8F98]" : "text-slate-500"}`}>{message}</p>
      <Link
        href={buttonHref}
        className="block w-full bg-[#29B28D] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#239979] transition-all"
      >
        {buttonText}
      </Link>
    </div>
  );
};
