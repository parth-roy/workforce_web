import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { PhoneCall } from 'lucide-react'

export default function Layout() {
  const { user, openAuthModal, logout } = useAuth();

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
              
              {user ? (
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase border-2 border-emerald-500">
                    {user.firstName?.[0] || user.name?.[0] || 'U'}
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.firstName || user.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.phone}</p>
                    </div>
                    <Link to="/user/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">My Bookings</Link>
                    <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Log out</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => openAuthModal('CUSTOMER')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md transition-colors text-sm">
                  Login / Signup
                </button>
              )}
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
              <span className="font-black text-2xl text-white">Metro Mitra</span>
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
