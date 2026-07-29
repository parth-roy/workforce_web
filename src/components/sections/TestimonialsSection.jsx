import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const workerTestimonials = [
  {
    name: 'Raju Mondal',
    role: 'Loading Worker',
    location: 'Howrah, Shibpur',
    avatar: 'RM',
    rating: 5,
    quote: 'Aage naka pe danda karke baith ta tha. Ab phone pe job milti hai aur sham ko paisa aa jata hai. GoMyTruck ne sab change kar diya.',
  },
  {
    name: 'Bimal Das',
    role: 'Warehouse Helper',
    location: 'Taratala Industrial Area',
    avatar: 'BD',
    rating: 5,
    quote: 'মাসে মাসে মাইনে পেতাম। এখন প্রতিদিন টাকা পাচ্ছি। তিন মাসে নিজের ঘর বানালাম। সবাইকে বলছি GoMyTruck use করো।',
  },
  {
    name: 'Santosh Kumar',
    role: 'Delivery Executive',
    location: 'New Town, Rajarhat',
    avatar: 'SK',
    rating: 5,
    quote: 'I was nervous about digital payment but the app is very simple. I earned Rs.14,000 in my first month working weekends only. Now I do full-time.',
  },
]

const employerTestimonials = [
  {
    name: 'Priya Agarwal',
    role: 'Operations Head',
    company: 'Dankuni Logistics Pvt. Ltd.',
    avatar: 'PA',
    rating: 5,
    quote: 'We needed 30 loading workers for a festive season rush with 48 hours notice. GoMyTruck delivered 28 verified workers. The compliance dashboard saved us 3 days of HR paperwork.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Warehouse Manager',
    company: 'Salt Lake Distribution Hub',
    avatar: 'AM',
    rating: 5,
    quote: 'The replacement guarantee is real. One worker didn\'t show and they had a replacement on-site within 90 minutes. That\'s the kind of reliability we need.',
  },
]

function Avatar({ initials, bg = 'bg-trust-blue-600' }) {
  return (
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
      {initials}
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [workerIndex, setWorkerIndex] = useState(0)

  const prev = () => setWorkerIndex(i => (i - 1 + workerTestimonials.length) % workerTestimonials.length)
  const next = () => setWorkerIndex(i => (i + 1) % workerTestimonials.length)

  const wt = workerTestimonials[workerIndex]

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">Real Stories, Real Earnings</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            From daily workers to enterprise clients — here's what they say.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Worker testimonials — carousel */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">👷 Worker Stories</p>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 relative min-h-[220px]">
              <StarRating rating={wt.rating} />
              <blockquote className="text-slate-700 text-base leading-relaxed mt-4 mb-6 italic">
                "{wt.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar initials={wt.avatar} bg="bg-action-green-600" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{wt.name}</p>
                  <p className="text-xs text-slate-500">{wt.role} · {wt.location}</p>
                </div>
              </div>
            </div>
            {/* Carousel controls */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={prev} aria-label="Previous testimonial" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {workerTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWorkerIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`rounded-full transition-all duration-200 ${
                      i === workerIndex ? 'w-6 h-2 bg-trust-blue-600' : 'w-2 h-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <button onClick={next} aria-label="Next testimonial" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Employer testimonials */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">🏢 Employer Stories</p>
            <div className="space-y-4">
              {employerTestimonials.map((et, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <StarRating rating={et.rating} />
                  <blockquote className="text-slate-700 text-sm leading-relaxed mt-3 mb-4 italic">
                    "{et.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar initials={et.avatar} bg="bg-trust-blue-700" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{et.name}</p>
                      <p className="text-xs text-slate-500">{et.role}</p>
                      <p className="text-xs text-trust-blue-600 font-medium">{et.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
