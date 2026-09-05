import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import WhatsAppIntentModal from '../common/WhatsAppIntentModal'

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-transform transform hover:scale-110 animate-bounce-slow cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      <WhatsAppIntentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialIntent="HIRE"
      />
    </>
  )
}

