import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';

export default function WorkerCTA() {
  return (
    <div className="bg-emerald-600 text-white py-12 px-8 rounded-2xl my-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Find Work Near You</h2>
          <p className="text-emerald-100 text-lg max-w-lg">
            Join the Metro Mitra worker network. Register through the app and receive job alerts for roles matching your skills and location.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a href="https://play.google.com/store/apps/details?id=com.gomytruck.workforce" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"><Smartphone className="w-5 h-5" /> Download App</a>
          <Link to="/jobs" className="flex items-center gap-2 bg-emerald-700 text-white border border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

