import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/919331488999?text=Hi%20GoMyTruck%20Workforce%20Team%2C%20I%20need%20help."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-transform transform hover:scale-110 animate-bounce-slow"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
