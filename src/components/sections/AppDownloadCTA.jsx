import React from 'react'
import { QrCode } from 'lucide-react'
import { APP_DOWNLOAD_URL } from '../../config/constants.js'
import PlayStoreIcon from '../ui/PlayStoreIcon.jsx'

export default function AppDownloadCTA({
  heading = 'Start Earning Today — Download the App',
  subheading = 'Join 28,000+ verified workers across West Bengal. Daily pay. 0 - 5% lowest commission.',
}) {
  return (
    <section className="bg-cta-green">
      <div className="container-xl py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <span className="pulse-dot bg-white" />
              <span className="text-sm font-bold text-white">Live on Google Play</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{heading}</h2>
            <p className="text-green-100 text-lg mb-8">{subheading}</p>

            <div className="flex flex-wrap gap-4">
              {/* Google Play */}
              <a
                href={APP_DOWNLOAD_URL}
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl transition-colors"
                aria-label="Download on Google Play"
              >
                <PlayStoreIcon size={24} />
                <div className="text-left">
                  <p className="text-xs text-slate-400">Get it on</p>
                  <p className="text-sm font-bold leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* QR Code Image */}
          <div className="flex justify-center md:justify-end">
            <img 
              src="/workforce-app.webp" 
              alt="Scan to Download Metro Mitra App" 
              className="w-full max-w-[280px] drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

