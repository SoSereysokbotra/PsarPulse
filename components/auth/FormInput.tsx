import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label: string;
  khmerLabel?: string;
  icon: React.ElementType;
  multiline?: boolean;
  rows?: number;
  rightLabelElement?: React.ReactNode; // Added this prop
}

export const FormInput = ({
  label,
  khmerLabel,
  icon: Icon,
  id,
  multiline,
  rows,
  className = "",
  rightLabelElement,
  ...props
}: FormInputProps) => {
  const sharedClasses = `block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white hover:border-slate-300 focus:border-psar-primary focus:ring-1 focus:ring-psar-primary/20 outline-none transition-all duration-200 ${props.disabled ? "opacity-70 cursor-not-allowed bg-slate-100" : ""}`;

  return (
    <div>
      {/* Wrapped label and right element in a flex container */}
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-bold text-slate-900">
          {label}{" "}
          {khmerLabel && (
            <span className="text-psar-primary flex-shrink-0 font-khmer ml-1 font-normal opacity-90">
              / {khmerLabel}
            </span>
          )}
        </label>

        {/* Render the right element if it exists */}
        {rightLabelElement && <div>{rightLabelElement}</div>}
      </div>

      <div className="relative group">
        <div
          className={`absolute left-0 pl-4 flex items-center pointer-events-none ${multiline ? "top-4" : "inset-y-0"}`}
        >
          <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors duration-200" />
        </div>
        {multiline ? (
          <textarea
            id={id}
            rows={rows}
            className={sharedClasses}
            {...(props as any)}
          />
        ) : (
          <input id={id} className={sharedClasses} {...(props as any)} />
        )}
      </div>
    </div>
  );
};
