import React from 'react'

export default function DualHero({ title, subtitle }) {
  return (
    <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">{title}</h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-12">{subtitle}</p>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Pathway A: Worker (Blue UI) */}
          <a 
            href="https://wa.me/919331488999?text=I%20want%20to%20work" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <span className="text-xl font-bold">I Want to Work</span>
            <span className="text-sm text-blue-200 mt-1">Mujhe Kaam Chahiye</span>
            <span className="mt-4 px-4 py-1.5 bg-blue-800 rounded-full text-xs font-semibold">Apply via WhatsApp</span>
          </a>

          {/* Pathway B: B2B Enterprise (Green UI) */}
          <a 
            href="https://gomytruck.com/enterprise" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-brand-600 hover:bg-brand-500 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <span className="text-xl font-bold">I Need Workers</span>
            <span className="text-sm text-brand-200 mt-1">Mujhe Worker Chahiye</span>
            <span className="mt-4 px-4 py-1.5 bg-brand-800 rounded-full text-xs font-semibold">Get Enterprise Lead</span>
          </a>
        </div>
      </div>
    </section>
  )
}
