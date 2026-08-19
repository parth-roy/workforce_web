import React from 'react';

export default function WorkerCTA() {
  return (
    <div className="bg-blue-600 text-white py-12 px-4 rounded-2xl my-12 text-center max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Ready to start earning?</h2>
      <p className="text-blue-100 mb-8 text-lg">Join Metro Mitra as a worker and find flexible opportunities near you.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors">Download Worker App</button>
        <button className="bg-blue-700 text-white border border-blue-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors">Learn More</button>
      </div>
    </div>
  );
}
