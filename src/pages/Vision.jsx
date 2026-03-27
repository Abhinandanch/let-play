import React from 'react';

function Vision() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Hero Header */}
      <div className="pt-32 pb-20 px-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 border-b border-slate-900 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-black text-yellow-400 italic tracking-tighter mb-8 uppercase leading-[0.8] drop-shadow-2xl">
            Our <br/> Vision
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-bold uppercase tracking-[0.25em] max-w-3xl mx-auto border-y border-slate-800 py-4">
            Supporting India's Local Legends
          </p>
        </div>
      </div>

      {/* Vision Blocks */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Support Local Matches */}
          <div className="bg-slate-900/30 p-12 rounded-[2rem] border border-slate-900 hover:bg-slate-900/50 transition-all">
            <span className="text-5xl mb-6 block">🇮🇳</span>
            <h2 className="text-4xl font-black text-white mb-6 italic uppercase tracking-tighter">Support Local Talent</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              India’s real talent isn't just in stadiums; it’s on the <span className="text-white font-bold italic">Gully Cricket grounds, local Football patches, and Kabaddi mats</span> of every village and city. Our vision is to provide a professional platform for these local matches, giving every player the recognition they deserve.
            </p>
          </div>

          {/* Promoting Outdoor Games */}
          <div className="bg-slate-900/30 p-12 rounded-[2rem] border border-slate-900 hover:bg-slate-900/50 transition-all">
            <span className="text-5xl mb-6 block">⚽</span>
            <h2 className="text-4xl font-black text-white mb-6 italic uppercase tracking-tighter">Bring Sports Back Outdoors</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              In a world dominated by screens, we are on a mission to <span className="text-yellow-400 font-bold italic">bring the youth back to the field</span>. By making it easy to host and join outdoor tournaments, we aim to revive the culture of physical sports, health, and real-world teamwork.
            </p>
          </div>
        </div>

        {/* Why it Matters Section */}
        <div className="mt-24 text-center bg-yellow-400 p-12 rounded-[3rem]">
          <h3 className="text-slate-950 text-3xl md:text-5xl font-black italic uppercase mb-4 tracking-tighter">
            Real Games. Real Sweat. Real Victory.
          </h3>
          <p className="text-slate-900 text-lg font-black uppercase tracking-widest opacity-80">
            From Dhanbad to the World — LET'S PLAY is for the Athletes of Today.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Vision;
