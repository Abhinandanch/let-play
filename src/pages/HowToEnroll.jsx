import React from 'react';
import { Link } from 'react-router-dom';

function HowToEnroll() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Hero Section */}
      <div className="pt-28 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black text-yellow-400 italic tracking-tighter mb-6 uppercase">
            Start Your Journey 🏆
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl font-bold uppercase tracking-[0.3em]">
            India's Premier Sports Networking Platform
          </p>
        </div>
      </div>

      {/* Main Steps Container */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Step 1 & 2: Onboarding & Discovery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-slate-900/40 p-10 rounded-3xl border-l-4 border-yellow-400 hover:bg-slate-900/60 transition-colors">
            <span className="text-yellow-400 font-black text-6xl opacity-20 block mb-4">01</span>
            <h2 className="text-3xl font-black mb-4 italic uppercase">Get Started</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Begin by heading to <span className="text-white font-bold">Signup</span> to register your team. Once registered, <span className="text-white font-bold">Login</span> with your Email and Password to enter the world of "LET'S PLAY". Your journey starts here!
            </p>
          </div>

          <div className="bg-slate-900/40 p-10 rounded-3xl border-l-4 border-yellow-400 hover:bg-slate-900/60 transition-colors">
            <span className="text-yellow-400 font-black text-6xl opacity-20 block mb-4">02</span>
            <h2 className="text-3xl font-black mb-4 italic uppercase">Discover & Enroll</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Explore live <span className="text-white font-bold">Matches and Tournaments</span> on the Home Page. Use the <span className="text-white font-bold">Search Bar</span> to find games in your location. Interested? Click <span className="text-white font-bold">'Enroll'</span> to send your team details directly to the host.
            </p>
          </div>
        </div>

        {/* Features Row (Sports Shortcuts) */}
        <div className="bg-slate-900/80 p-8 rounded-3xl mb-20 border border-slate-800 text-center">
          <h3 className="text-yellow-400 font-black text-xl mb-8 tracking-[0.3em] uppercase">Quick Filters</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-black">
            {['Cricket', 'Football', 'Volleyball', 'Kabaddi', 'FreeFire', 'PUBG'].map((sport) => (
              <span key={sport} className="px-8 py-3 bg-slate-950 border border-slate-800 rounded-full hover:border-yellow-400 hover:text-yellow-400 cursor-pointer transition-all uppercase tracking-widest">
                {sport}
              </span>
            ))}
          </div>
          <p className="mt-6 text-slate-500 font-bold italic">Use these shortcuts to find the sports you love instantly!</p>
        </div>

        {/* Step 3 & 4: Hosting & Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-900/40 p-10 rounded-3xl border-l-4 border-yellow-400 hover:bg-slate-900/60 transition-colors">
            <span className="text-yellow-400 font-black text-6xl opacity-20 block mb-4">03</span>
            <h2 className="text-3xl font-black mb-4 italic uppercase">Host Your Own</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Want to organize a match? Click on your <span className="text-white font-bold">Name</span> at the top to access your <span className="text-white font-bold">Dashboard</span>. From there, you can post your own Match or Tournament and invite teams to enroll.
            </p>
          </div>

          <div className="bg-slate-900/40 p-10 rounded-3xl border-l-4 border-yellow-400 hover:bg-slate-900/60 transition-colors">
            <span className="text-yellow-400 font-black text-6xl opacity-20 block mb-4">04</span>
            <h2 className="text-3xl font-black mb-4 italic uppercase">Manage & Socialize</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Manage your posts, view applicants, and <span className="text-white font-bold">Contact</span> them directly from your Dashboard. Build your network by <span className="text-white font-bold">Following</span> other teams and engaging through <span className="text-white font-bold">Likes and Comments</span>.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-black italic mb-8 uppercase tracking-tighter">Ready to take the field?</h2>
          <Link to="/" className="inline-block bg-yellow-400 text-slate-950 px-16 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-transform uppercase italic tracking-tighter shadow-[0_0_30px_rgba(250,204,21,0.3)]">
            Explore Matches Now
          </Link>
        </div>

      </div>
    </div>
  );
}

export default HowToEnroll;
