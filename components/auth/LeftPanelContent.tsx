import { ReactNode } from "react";
import Link from "next/link";

interface LeftPanelContentProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  features?: Array<{ title: string; desc: string }>;
  footerText?: string;
}

export const LeftPanelContent = ({
  icon,
  title,
  subtitle,
  features,
  footerText,
}: LeftPanelContentProps) => (
  <>
    <div className="relative z-10">
      <span className="font-extrabold text-2xl tracking-tight text-white/90">
        <span className="text-psar-primary">PsarPulse</span> KH
      </span>
    </div>

    <div className="relative z-10 my-auto">
      <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.2] mb-6 tracking-tight text-white">
        {title}
      </h2>
      <p className="text-white/70 text-lg max-w-sm mb-12 leading-relaxed">
        {subtitle}
      </p>

      {features && (
        <div className="space-y-6">
          {features.map((f, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="mt-1 w-6 h-6 rounded-full bg-psar-primary/20 flex items-center justify-center flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-psar-primary" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1.5 text-white/90">
                  {f.title}
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <p className="relative z-10 text-white/50 text-sm font-medium tracking-wide">
      {footerText ||
        "© 2026 PsarPulse KH • Developed at Kirirom Institute of Technology"}
    </p>
  </>
);
