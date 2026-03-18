import React, { useRef } from "react";

interface OTPInputProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  disabled?: boolean;
}

export const OTPInput = ({ otp, setOtp, disabled }: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-white border border-slate-200 shadow-sm hover:border-slate-300 rounded-xl focus:bg-white focus:border-psar-primary focus:ring-1 focus:ring-psar-primary/20 outline-none transition-all duration-200 disabled:opacity-50"
          required
        />
      ))}
    </div>
  );
};
