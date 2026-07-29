import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { PhoneCall } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex flex-col justify-center items-start">
              <span className="font-black text-2xl tracking-tight text-slate-900 leading-none">
                Go<span className="text-brand-600">My</span>Truck <span className="text-slate-500 font-medium">Workforce</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <a href="tel:9331488999" className="flex items-center gap-2 font-bold text-slate-700 hover:text-brand-600">
                <PhoneCall size={18} className="text-brand-500" />
                <span className="hidden sm:inline">9331488999</span>
              </a>
              <div className="flex gap-2">
                <button className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">A</button>
                <button className="text-xs font-bold px-2 py-1 hover:bg-slate-100 rounded text-slate-400">অ</button>
                <button className="text-xs font-bold px-2 py-1 hover:bg-slate-100 rounded text-slate-400">अ</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="font-black text-2xl text-white">GoMyTruck</span>
              <p className="mt-2 text-sm max-w-sm">Parther Technologies Pvt. Ltd.<br/>Barrackpore, West Bengal<br/>CIN: U60232WB2022PTC255655</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm">© 2026 Parther Technologies Pvt. Ltd.</p>
              <div className="mt-2 flex md:justify-end gap-4 text-sm">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
