import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, Users, CheckCircle2 } from "lucide-react";

const SERVICE_CARDS = [
  { type: "home",       title: "Home Services",      desc: "Electricians, Plumbers, AC Technicians & more", href: "/services"    },
  { type: "enterprise", title: "Enterprise Staffing", desc: "Warehouse, Delivery, Loaders & more",            href: "/hire-workers" },
  { type: "gig",        title: "Gig Jobs",            desc: "Helpers, Packers, Movers & more",                href: "/jobs"         },
];

const STATS = [
  { value: "12,500+", label: "Verified Workers",  color: "text-[#1E3A8A]" },
  { value: "98,300+", label: "Jobs Completed",    color: "text-[#10B981]" },
  { value: "4.8/5",   label: "Business Trust",    color: "text-purple-600" },
];

function cardIconBg(t){ return t==="home"?"bg-emerald-50":t==="enterprise"?"bg-blue-50":"bg-orange-50"; }
function CardIcon({ type }){
  const s="w-5 h-5";
  if(type==="home")       return <Home       className={`${s} text-[#10B981]`}/>;
  if(type==="enterprise") return <Building2  className={`${s} text-[#1E3A8A]`}/>;
  return                         <Users      className={`${s} text-[#F97316]`}/>;
}

function StatIcon({ i }){
  if(i===0) return(
    <svg className="w-6 h-6 text-[#1E3A8A]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
    </svg>);
  if(i===1) return(
    <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
    </svg>);
  return(
    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
    </svg>);
}

function Badge(){
  return(
    <span className="inline-flex items-center gap-1.5 self-start bg-white border border-slate-200 text-[#10B981] text-xs font-semibold rounded-full px-3 py-1 mb-5 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"/>
      Gig Workforce Platform — West Bengal
    </span>
  );
}

function Headline({ className="" }){
  return(
    <h1 className={`font-black leading-[1.08] tracking-tight ${className}`}>
      <span className="text-[#1E3A8A]">Building Work.</span><br/>
      <span className="text-[#10B981]">Empowering</span><br/>
      <span className="text-[#1E3A8A]">Communities.</span>
    </h1>
  );
}

function StatsBar({ compact=false }){
  return(
    <div className={`bg-white rounded-2xl shadow border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 ${compact?"py-3":"py-4"}`}>
      {STATS.map((s,i)=>(
        <div key={s.label} className={`flex flex-col items-center text-center ${compact?"px-2":"px-4"}`}>
          <StatIcon i={i}/>
          <span className={`font-black ${s.color} leading-tight mt-1 ${compact?"text-sm":"text-lg xl:text-xl"}`}>{s.value}</span>
          <span className={`text-slate-500 leading-tight ${compact?"text-[9px] mt-0.5":"text-[11px] mt-1"}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function SvcCard({ card, sm=false }){
  return(
    <Link to={card.href} className={`group flex items-center bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all ${sm?"gap-2 px-2.5 py-2":"gap-3 px-4 py-3.5"}`}>
      <div className={`rounded-lg ${cardIconBg(card.type)} flex items-center justify-center shrink-0 ${sm?"w-7 h-7":"w-9 h-9"}`}>
        <CardIcon type={card.type}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[#1E3A8A] font-bold leading-tight ${sm?"text-[10px]":"text-sm"}`}>{card.title}</p>
        <p className={`text-slate-500 leading-tight mt-0.5 ${sm?"text-[9px] line-clamp-2":"text-xs truncate"}`}>{card.desc}</p>
      </div>
      {!sm&&<ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#10B981] shrink-0 transition-colors"/>}
    </Link>
  );
}

/* ── Central visual card for the big image ── */
function HeroImageCard({ label, img, alt, className="" }){
  return(
    <div className={`relative rounded-2xl overflow-hidden border-2 border-white shadow-xl ${className}`}>
      <img src={img} alt={alt} className="w-full h-full object-cover object-center"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
      <span className="absolute bottom-2 left-2.5 text-white text-[10px] font-bold bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
        {label}
      </span>
    </div>
  );
}

export default function HomeHero(){
  return(
    <section className="relative overflow-hidden bg-white pt-20">

      {/* CSS decorative background – soft blue circles on the right */}
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-100px] right-[-140px] w-[640px] h-[640px] rounded-full bg-[#DEEEFF] opacity-65"/>
        <div className="absolute top-[40px] right-[-20px] w-[400px] h-[400px] rounded-full bg-[#C4DEFF] opacity-50"/>
        <div className="absolute top-[20px] right-[120px] w-[180px] h-[180px] rounded-full bg-[#B0D0F8] opacity-45"/>
        <div className="absolute bottom-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-[#E4F2FF] opacity-50"/>
        {/* Dotted grid top-left */}
        <div className="absolute top-14 left-8 opacity-20 hidden md:block">
          {[...Array(5)].map((_,r)=>(
            <div key={r} className="flex gap-3 mb-3">
              {[...Array(5)].map((_,c)=>(<div key={c} className="w-1 h-1 rounded-full bg-[#1E3A8A]"/>))}
            </div>
          ))}
        </div>
        {/* Dotted grid bottom-right */}
        <div className="absolute bottom-10 right-8 opacity-15 hidden lg:block">
          {[...Array(4)].map((_,r)=>(
            <div key={r} className="flex gap-3 mb-3">
              {[...Array(4)].map((_,c)=>(<div key={c} className="w-1 h-1 rounded-full bg-[#1E3A8A]"/>))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ DESKTOP ≥1024px ══════════ */}
      <div className="hidden lg:grid relative z-10 w-full max-w-[1400px] mx-auto px-8 xl:px-14
                      grid-cols-[380px_1fr_290px] xl:grid-cols-[420px_1fr_310px]
                      items-start" style={{minHeight:"calc(100vh - 80px)"}}>

        {/* LEFT */}
        <div className="flex flex-col justify-center pt-14 xl:pt-20 pb-12 pr-6">
          <Badge/>
          <Headline className="text-[2.5rem] xl:text-[3rem] mb-5"/>
          <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-[300px] xl:max-w-[320px]">
            Metro Mitra connects households and businesses with verified gig workers across West Bengal.
            Trusted. Reliable. On-demand.
          </p>
          <div className="flex items-center gap-3 mb-10">
            <Link to="/services"
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-lg shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all">
              Hire Services <ArrowRight className="w-4 h-4"/>
            </Link>
            <Link to="/jobs"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#1E3A8A] border border-slate-200 font-bold text-sm px-5 py-3 rounded-lg transition-all">
              Join as Employee
            </Link>
          </div>
          <StatsBar/>
        </div>

        {/* CENTER – image composition */}
        <div className="relative flex items-center justify-center py-10">
          {/* Main large image – center */}
          <div className="relative z-[2] w-[68%] max-w-[380px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl aspect-[3/4]">
            <img src="/all-worker-roles.webp" alt="Metro Mitra gig workers – home services, delivery and warehouse"
              className="w-full h-full object-cover object-[center_20%]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-3 py-1.5">
              <span className="text-white text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]"/> Verified Workers
              </span>
            </div>
          </div>

          {/* Top-right supporting: warehouse */}
          <div className="absolute top-[6%] right-[4%] z-[3] w-[38%] max-w-[190px] rounded-2xl overflow-hidden border-2 border-white shadow-xl aspect-video">
            <img src="/warehouse-hero.webp" alt="Warehouse staffing"
              className="w-full h-full object-cover object-[center_30%]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            <span className="absolute bottom-1.5 left-2 text-white text-[9px] font-bold">Enterprise Staffing</span>
          </div>

          {/* Bottom-right supporting: employer/hiring */}
          <div className="absolute bottom-[8%] right-[6%] z-[3] w-[34%] max-w-[170px] rounded-2xl overflow-hidden border-2 border-white shadow-xl aspect-video">
            <img src="/employer-hiring-hero.webp" alt="Hiring services"
              className="w-full h-full object-cover object-[center_25%]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            <span className="absolute bottom-1.5 left-2 text-white text-[9px] font-bold">Home Services</span>
          </div>

          {/* Accent dots */}
          <span className="absolute top-[22%] left-[10%] z-[4] w-3 h-3 rounded-full bg-[#1E3A8A] shadow" aria-hidden="true"/>
          <span className="absolute top-[55%] left-[8%] z-[4] w-3 h-3 rounded-full bg-[#10B981] shadow" aria-hidden="true"/>
          <span className="absolute bottom-[20%] left-[16%] z-[4] w-2 h-2 rounded-full bg-[#F97316] shadow" aria-hidden="true"/>
        </div>

        {/* RIGHT – service cards */}
        <div className="flex flex-col justify-center gap-3 pt-28 pb-10 pl-4">
          {SERVICE_CARDS.map(c=><SvcCard key={c.title} card={c}/>)}
        </div>
      </div>

      {/* ══════════ TABLET 768–1023px ══════════ */}
      <div className="hidden md:flex lg:hidden relative z-10 flex-col max-w-3xl mx-auto px-6 pt-10">
        <Badge/>
        <Headline className="text-[2.2rem] mb-4"/>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
          Metro Mitra connects households and businesses with verified gig workers across West Bengal. Trusted. Reliable. On-demand.
        </p>
        <div className="flex gap-3 mb-8">
          <Link to="/services" className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all">
            Hire Services <ArrowRight className="w-4 h-4"/>
          </Link>
          <Link to="/jobs" className="inline-flex items-center justify-center bg-white text-[#1E3A8A] border border-slate-200 font-bold text-sm px-5 py-2.5 rounded-lg transition-all">
            Join as Employee
          </Link>
        </div>
        <div className="flex gap-4 items-start">
          {/* Main image */}
          <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-white shadow-xl" style={{aspectRatio:"3/4", maxWidth:"260px"}}>
            <img src="/all-worker-roles.webp" alt="Metro Mitra gig workers" className="w-full h-full object-cover object-[center_20%]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
          </div>
          {/* Supporting + cards */}
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="rounded-xl overflow-hidden border-2 border-white shadow-lg" style={{aspectRatio:"16/9"}}>
              <img src="/warehouse-hero.webp" alt="Warehouse" className="w-full h-full object-cover object-[center_30%]"/>
            </div>
            {SERVICE_CARDS.map(c=><SvcCard key={c.title} card={c} sm/>)}
          </div>
        </div>
        <div className="mt-5 mb-0"><StatsBar/></div>
      </div>

      {/* ══════════ MOBILE <768px ══════════ */}
      <div className="flex flex-col md:hidden relative z-10 px-4 pt-6">
        <Badge/>
        <Headline className="mb-3" style={{fontSize:"clamp(1.8rem,8vw,2.3rem)"}}/>
        <p className="text-slate-500 text-sm leading-relaxed mb-5">
          Metro Mitra connects households and businesses with verified gig workers across West Bengal. Trusted. Reliable. On-demand.
        </p>

        {/* CTAs */}
        <Link to="/services" className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-lg shadow-md shadow-emerald-500/20 mb-2.5 active:scale-[0.98] transition-all">
          Hire Services <ArrowRight className="w-4 h-4"/>
        </Link>
        <Link to="/jobs" className="w-full flex items-center justify-center bg-white text-[#1E3A8A] border border-slate-200 font-bold text-sm py-3 rounded-lg mb-6 transition-all">
          Join as Employee
        </Link>

        {/* Visual composition */}
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {/* Main image tall – left */}
          <div className="row-span-2 rounded-2xl overflow-hidden border-2 border-white shadow-xl" style={{aspectRatio:"3/4"}}>
            <img src="/all-worker-roles.webp" alt="Metro Mitra gig workers" className="w-full h-full object-cover object-[center_20%]"/>
          </div>
          {/* Top-right: warehouse */}
          <div className="rounded-xl overflow-hidden border-2 border-white shadow-lg" style={{aspectRatio:"16/9"}}>
            <img src="/warehouse-hero.webp" alt="Warehouse staffing" className="w-full h-full object-cover object-[center_30%]"/>
          </div>
          {/* Cards stacked bottom-right */}
          <div className="flex flex-col gap-1.5">
            {SERVICE_CARDS.map(c=><SvcCard key={c.title} card={c} sm/>)}
          </div>
        </div>

        <div className="mt-1"><StatsBar compact/></div>
      </div>

      <div className="h-8 md:h-12"/>
    </section>
  );
}
