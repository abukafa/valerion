"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertCircle, HelpCircle, X } from "lucide-react";

interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  placeholder?: string;
}

interface DialogContextType {
  showAlert: (options: DialogOptions | string) => Promise<void>;
  showConfirm: (options: DialogOptions | string) => Promise<boolean>;
  showPrompt: (options: DialogOptions | string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isPrompt, setIsPrompt] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [options, setOptions] = useState<DialogOptions>({
    title: "",
    message: "",
  });
  
  // Resolve function to return the promise result
  const [resolveFn, setResolveFn] = useState<(value: any) => void>();

  const showAlert = (opts: DialogOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      const parsedOpts = typeof opts === "string" ? { title: "Informasi", message: opts } : opts;
      setOptions(parsedOpts);
      setIsConfirm(false);
      setIsPrompt(false);
      setIsOpen(true);
      setResolveFn(() => resolve);
    });
  };

  const showConfirm = (opts: DialogOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const parsedOpts = typeof opts === "string" ? { title: "Konfirmasi", message: opts } : opts;
      setOptions(parsedOpts);
      setIsConfirm(true);
      setIsPrompt(false);
      setIsOpen(true);
      setResolveFn(() => resolve);
    });
  };

  const showPrompt = (opts: DialogOptions | string): Promise<string | null> => {
    return new Promise((resolve) => {
      const parsedOpts = typeof opts === "string" ? { title: "Masukkan Data", message: opts } : opts;
      setOptions(parsedOpts);
      setIsConfirm(false);
      setIsPrompt(true);
      setPromptValue("");
      setIsOpen(true);
      setResolveFn(() => resolve);
    });
  };

  const handleClose = (result: any) => {
    setIsOpen(false);
    if (resolveFn) {
      resolveFn(result);
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {/* Modal UI */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => handleClose(false)} 
          />
          
          <div className="relative bg-card border border-card-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header / Icon */}
            <div className={`p-6 pb-0 flex flex-col items-center text-center`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                options.type === 'danger' ? 'bg-red-500/20 text-red-500' :
                options.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-primary/20 text-primary'
              }`}>
                {options.type === 'danger' ? <AlertCircle className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{options.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                {options.message}
              </p>
              
              {isPrompt && (
                <div className="w-full mt-2 text-left">
                  <textarea
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={options.placeholder || "Ketikkan sesuatu..."}
                    className="w-full bg-secondary border border-card-border rounded-xl p-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px]"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 flex flex-col sm:flex-row gap-3 mt-2">
              {isPrompt ? (
                <>
                  <button 
                    onClick={() => handleClose(null)}
                    className="flex-1 px-4 py-3 bg-secondary hover:bg-secondary/80 text-white font-bold rounded-xl transition-colors"
                  >
                    {options.cancelText || "Batal"}
                  </button>
                  <button 
                    onClick={() => handleClose(promptValue)}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(255,77,0,0.3)]"
                  >
                    {options.confirmText || "OK"}
                  </button>
                </>
              ) : isConfirm ? (
                <>
                  <button 
                    onClick={() => handleClose(false)}
                    className="flex-1 px-4 py-3 bg-secondary hover:bg-secondary/80 text-white font-bold rounded-xl transition-colors"
                  >
                    {options.cancelText || "Batal"}
                  </button>
                  <button 
                    onClick={() => handleClose(true)}
                    className={`flex-1 px-4 py-3 font-bold rounded-xl transition-colors shadow-lg ${
                      options.type === 'danger' 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,77,0,0.3)]'
                    }`}
                  >
                    {options.confirmText || "Ya, Lanjutkan"}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleClose(true)}
                  className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(255,77,0,0.3)]"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
