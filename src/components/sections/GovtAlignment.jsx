import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const govPrograms = [
  {
    emoji: '🏛️',
    title: 'e-Shram Integration',
    description: 'All workers registered on Metro Mitra can link their e-Shram UAN directly in-app, unlocking government social security benefits, accident insurance, and portable work history.',
    link: 'https://eshram.gov.in',
    cta: 'Learn about e-Shram',
  },
  {
    emoji: '🤝',
    title: 'Gatidhara Scheme Partner',
    description: 'Metro Mitra is aligned with West Bengal\'s Gatidhara Transport Scheme. Fleet owners and drivers in our network are eligible for subsidised vehicle financing and upskilling credits.',
    link: '#',
    cta: 'WB Transport Scheme',
  },
  {
    emoji: '📋',
    title: 'Code on Social Security 2020',
    description: 'Our platform payouts, contract structures, and worker classification are fully compliant with West Bengal\'s Code on Social Security 2020 — protecting every gig worker on our platform.',
    link: '#',
    cta: 'Compliance Details',
  },
]

export default function GovtAlignment() {
  return (
    <section className="bg-govt section-pad">
      <div className="container-xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <img src="/emblem.svg" alt="Emblem of India" loading="lazy" className="h-4 w-auto brightness-0 invert opacity-90" />
            <span className="text-amber-300 text-sm font-bold">Government Alignment</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Backed by Government Digital Infrastructure
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Metro Mitra is not just a platform — it's part of West Bengal's mission to formalize the gig economy and protect its 23.5 million gig workers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {govPrograms.map((p, i) => (
            <div key={i} className="bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-colors">
              <div className="text-4xl mb-4">{p.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">{p.description}</p>
              <a
                href={p.link}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-action-green-400 hover:text-action-green-300 transition-colors"
              >
                {p.cta} <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
