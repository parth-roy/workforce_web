import React, { useState } from 'react';
import SEO from '../../components/ui/SEO';
import { Phone, Mail, MessageSquare, MapPin, Send, CheckCircle, AlertTriangle } from 'lucide-react';

const SERVICE_OPTIONS = [
  'Individual Home Service (Electrician, Plumber, etc.)',
  'Cleaning Service',
  'Moving Help',
  'Warehouse / Logistics Staffing',
  'Contractor Workforce',
  'Corporate Workforce',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit phone number.';
    if (!form.message.trim()) e.message = 'Please describe how we can help.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const contacts = [
    { icon: MessageSquare, label: 'WhatsApp', value: '+91 XXXXX XXXXX', note: 'Placeholder — backend integration pending', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { icon: Phone, label: 'Phone', value: '+91 XXXXX XXXXX', note: 'Business hours only (placeholder)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: Mail, label: 'Email', value: 'hello@metromitra.in', note: 'Placeholder email address', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
    { icon: MapPin, label: 'Office', value: 'West Bengal, India', note: 'Operations region (address TBC)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ];

  return (
    <>
      <SEO
        title="Contact Metro Mitra — Get In Touch"
        description="Contact Metro Mitra for help with hiring workers, finding jobs, or enterprise workforce enquiries."
        canonical="https://metromitra.in/contact"
        robots="index, follow"
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-300">Have a question, a workforce requirement, or need help getting started? Reach out to us.</p>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-16">

        {/* Contact cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map(({ icon: Icon, label, value, note, color, bg, border }) => (
              <div key={label} className={`${bg} border ${border} rounded-2xl p-6`}>
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{label}</p>
                <p className="font-semibold text-slate-700 mb-2">{value}</p>
                <p className="text-xs text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
            <p className="text-slate-500 mb-8">Fill in the form and we'll get back to you shortly.</p>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Received!</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    <strong>Frontend Prototype:</strong> We'll be in touch shortly. This is a prototype — no message was actually sent. Backend integration is coming soon.
                  </p>
                </div>
                <button onClick={() => { setForm({ name: '', phone: '', service: '', message: '' }); setSubmitted(false); }} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                  {errors.name && <p className="text-red-600 text-xs mb-1">{errors.name}</p>}
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                  {errors.phone && <p className="text-red-600 text-xs mb-1">{errors.phone}</p>}
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Service of Interest</label>
                  <select
                    value={form.service}
                    onChange={e => set('service', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-colors bg-white"
                  >
                    <option value="">Select (optional)</option>
                    {SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
                  {errors.message && <p className="text-red-600 text-xs mb-1">{errors.message}</p>}
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Describe how we can help..."
                    className={`w-full px-4 py-3 border ${errors.message ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-colors resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Send Message
                </button>
                <p className="text-xs text-slate-400 text-center">
                  We aim to respond within 24 hours (placeholder — actual SLA TBC).
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Quick FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q: 'How do I book a service?', a: 'Browse services at /services, select your task, and complete the request form.' },
              { q: 'How do I find jobs?', a: 'Visit /jobs and browse available roles. Download the Worker App to apply.' },
              { q: 'How do I hire multiple workers?', a: 'Go to /for-contractors or /for-companies for team-level workforce solutions.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="font-bold text-slate-900 text-sm mb-2">{q}</p>
                <p className="text-slate-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
