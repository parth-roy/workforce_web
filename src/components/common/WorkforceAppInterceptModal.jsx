import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Smartphone, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import QRCode from 'qrcode';
import { APP_DOWNLOAD_URL } from '../../config/constants.js';

export default function WorkforceAppInterceptModal({ 
  isOpen, 
  onClose 
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Generate crisp QR code pointing to unified Metro Mitra app
  useEffect(() => {
    QRCode.toDataURL(APP_DOWNLOAD_URL, {
      width: 400,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M'
    }).then(setQrDataUrl).catch(console.error);
  }, []);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const activeQr = qrDataUrl || '/workforce-app.webp';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Dialog - Ultra Compact, Pure White, Perfect Mobile Visibility */}
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200 my-auto text-slate-900 z-10"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Top Accent Line in Emerald/Teal */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all z-20 cursor-pointer active:scale-95"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Inner Container - Compact Vertical Padding */}
        <div className="p-4 sm:p-5 flex flex-col items-center text-center">
          
          {/* App Icon + Rating */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 p-1.5 shadow-sm border bg-emerald-50 border-emerald-200">
              <img 
                src="/logo.png" 
                alt="Metro Mitra Logo" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => { e.target.src = "/workforce-app.webp" }}
              />
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-slate-900 leading-tight">
                Metro Mitra App
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Official Mobile Application</span>
            </div>
          </div>

          {/* Simple Direct Title */}
          <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-950 leading-snug">
            To Book Services &amp; Work, <span className="text-emerald-600">Install Metro Mitra</span>
          </h2>

          <p className="mt-1 text-xs text-slate-500 font-medium max-w-xs leading-relaxed mb-3">
            Book home technicians or find high-paying daily jobs with instant bank payouts on the official app.
          </p>

          {/* Desktop QR Code (Big, Crisp, High-Resolution) */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 my-2 w-full max-w-[270px] shadow-sm">
            {activeQr ? (
              <img 
                src={activeQr} 
                alt="Metro Mitra App QR Code" 
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl bg-white p-2 border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white border border-slate-200 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-xs text-slate-400 font-medium">Loading QR...</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-700 font-bold">
              <Smartphone size={13} className="text-emerald-500" />
              <span>Scan with phone camera to install</span>
            </div>
          </div>

          {/* Google Play Install Button (Visible on both Web & Mobile, Pure White Mode) */}
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl text-slate-900 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 active:scale-98 transition-all shadow-xs hover:shadow-sm cursor-pointer group mt-1.5"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.006 2.006 0 01-.61-1.442V3.256c0-.555.226-1.073.61-1.442z" fill="#00C1FF"/>
              <path d="M17.155 8.637l-3.363 3.363 3.363 3.363 3.82-2.183c1.096-.627 1.096-1.733 0-2.36l-3.82-2.183z" fill="#FFC900"/>
              <path d="M3.609 1.814l10.183 10.186 3.363-3.363L6.34 2.378C5.267 1.764 4.195 1.542 3.609 1.814z" fill="#00E676"/>
              <path d="M13.792 12L3.609 22.186c.586.272 1.658.05 2.731-.564l10.815-6.259-3.363-3.363z" fill="#FF3A44"/>
            </svg>
            <div className="flex flex-col text-left leading-none whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-600">GET IT ON</span>
              <span className="text-sm font-black text-slate-900 tracking-tight mt-0.5">Google Play</span>
            </div>
            <ExternalLink size={14} className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </a>

          {/* Footer Escape Hatch & Cross-Promotion */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-500">
            <a 
              href="https://gomytruck.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-0.5 transition-colors"
            >
              GoMyTruck <ChevronRight size={11} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 font-bold underline transition-colors cursor-pointer"
            >
              Skip &amp; Continue on Web
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
