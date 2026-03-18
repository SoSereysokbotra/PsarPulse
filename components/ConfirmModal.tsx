import React from "react";
import { Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  previewText?: string;
  previewSubtext?: string;
  confirmText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  previewText,
  previewSubtext,
  confirmText = "Delete",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] p-7">
        <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-[#ef4444]" />
        </div>
        <div className="text-center mb-1">
          <div className="text-[17px] font-bold text-[#111827]">{title}</div>
          <div className="text-[13px] text-[#6b7280] mt-1.5 leading-relaxed">
            {description}
          </div>
        </div>

        {previewText && (
          <div className="mt-5 p-3.5 bg-[#f7f8fa] rounded-[10px] border border-[#e8eaed] mb-5">
            <div className="text-[13px] font-medium text-[#111827] truncate">
              {previewText}
            </div>
            {previewSubtext && (
              <div className="text-[12px] text-[#6b7280] mt-0.5">
                {previewSubtext}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[12px] bg-[#f0f2f5] text-[#6b7280] font-bold text-[14px] hover:bg-[#e8eaed] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-[12px] bg-[#ef4444] text-white font-bold text-[14px] hover:bg-[#dc2626] transition-colors shadow-[0_4px_14px_rgba(239,68,68,0.3)]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
