import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Smartphone, 
  ChevronRight, 
  ExternalLink,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { APP_DOWNLOAD_URL } from '../../config/constants.js';
import { lockScroll, unlockScroll } from '../../utils/scrollLock.js';

export default function WorkforceAppInterceptModal({ 
  isOpen, 
  onClose 
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showMobileQr, setShowMobileQr] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      setShowMobileQr(false);
      unlockScroll();
    }
    return () => {
      if (isOpen) {
        unlockScroll();
      }
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
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Modal Inner Container */}
        <div className="p-4 sm:p-6 flex flex-col items-center text-center">
          
          {/* App Header (Clean standalone logo without circular box or border) */}
          <div className="flex items-center gap-3 mb-2.5">
            <img 
              src="/metro-mitra-icon.png" 
              alt="Metro Mitra Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
              onError={(e) => { e.target.src = "/metromitra-logo.png" }}
            />
            <div className="text-left">
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                Metro <span className="text-emerald-600">Mitra</span> App
              </h3>
              <span className="text-xs text-slate-600 font-extrabold">Official Mobile Application</span>
            </div>
          </div>

          {/* Simple Direct Title */}
          <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-950 leading-snug">
            To Book Services &amp; Work, Install <span className="text-emerald-600">Metro Mitra</span>
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-800 font-extrabold max-w-sm leading-relaxed mb-3">
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
                <span className="text-xs text-slate-400 font-bold">Loading QR...</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2.5">
              <Smartphone size={22} strokeWidth={2.5} className="text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-950 font-black">Scan with phone camera to install</span>
            </div>
          </div>

          {/* Google Play & QR Action Bar */}
          <div className="w-full py-2.5 px-3 sm:px-4 rounded-xl text-slate-900 flex items-center justify-between gap-2 sm:gap-3 bg-white border border-slate-300 hover:border-slate-400 transition-all shadow-xs mt-2">
            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 overflow-hidden"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.006 2.006 0 01-.61-1.442V3.256c0-.555.226-1.073.61-1.442z" fill="#00C1FF"/>
                <path d="M17.155 8.637l-3.363 3.363 3.363 3.363 3.82-2.183c1.096-.627 1.096-1.733 0-2.36l-3.82-2.183z" fill="#FFC900"/>
                <path d="M3.609 1.814l10.183 10.186 3.363-3.363L6.34 2.378C5.267 1.764 4.195 1.542 3.609 1.814z" fill="#00E676"/>
                <path d="M13.792 12L3.609 22.186c.586.272 1.658.05 2.731-.564l10.815-6.259-3.363-3.363z" fill="#FF3A44"/>
              </svg>
              <div className="flex flex-col text-left leading-none whitespace-nowrap min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-600 truncate">GET IT ON</span>
                <span className="text-base font-black text-slate-950 tracking-tight mt-0.5 truncate">Google Play</span>
              </div>
            </a>

            {/* Mobile Only: QR Code Preview Button */}
            <button
              type="button"
              onClick={() => setShowMobileQr(true)}
              className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
              title="View QR Code"
              aria-label="View QR Code"
            >
              <QrCode size={19} strokeWidth={2.5} className="text-slate-800" />
            </button>

            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
              onClick={onClose}
              aria-label="Open in Google Play Store"
            >
              <ExternalLink size={19} strokeWidth={2.5} />
            </a>
          </div>

          {/* Footer Escape Hatch & Cross-Promotion */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs sm:text-sm">
            <a 
              href="https://gomytruck.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-900 hover:text-amber-600 font-black flex items-center gap-1 transition-colors"
            >
              <span>Go<span className="text-orange-500">My</span>Truck</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-700 hover:text-slate-950 font-black underline transition-colors cursor-pointer"
            >
              Skip &amp; Continue on Web
            </button>
          </div>

        </div>
      </div>

      {/* Mobile-Only Big QR Code Modal (Layered on top, returns to previous modal on close) */}
      {showMobileQr && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm sm:hidden animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowMobileQr(false)}
        >
          <div 
            className="relative w-full max-w-[300px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 flex flex-col items-center text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Bar: Clean Title & Non-overlapping Cross Button */}
            <div className="w-full flex items-center justify-between mb-3 pl-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Metro Mitra QR
              </span>
              <button
                type="button"
                onClick={() => setShowMobileQr(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-all cursor-pointer active:scale-95 shrink-0"
                aria-label="Return to previous modal"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Responsive Aspect-Square QR Code Frame with balanced padding */}
            <div className="w-full aspect-square max-w-[240px] bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center justify-center">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Metro Mitra App QR Code" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-bold">Loading QR...</span>
                </div>
              )}
            </div>

            {/* Centered Scan Prompt */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-900 font-black text-xs">
              <Smartphone size={16} strokeWidth={2.5} className="text-emerald-600 shrink-0" />
              <span>Scan with camera to install</span>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
