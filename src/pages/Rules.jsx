import React from 'react';

function Rules() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Header Section */}
      <div className="pt-28 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-yellow-400 italic tracking-tighter mb-4 uppercase">
            Rules & Regulations ⚖️
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl uppercase tracking-widest">
            Guidelines for a Fair, Competitive, and Disciplined Sporting Environment.
          </p>
        </div>
      </div>

      {/* Rules Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-12">
          
          {/* Section 1: Registration */}
          <section className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic uppercase">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded italic">01</span> Registration & Teams
            </h2>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex gap-4">✅ <p>All teams must provide <span className="text-white">accurate details</span> (Team Name, Captain Info) during enrollment.</p></li>
              <li className="flex gap-4">✅ <p>Any <span className="text-white">duplicate registrations</span> or fake profiles will lead to an immediate permanent ban.</p></li>
              <li className="flex gap-4">✅ <p>The Host has the final right to <span className="text-white">Accept or Reject</span> any team's enrollment based on their criteria.</p></li>
            </ul>
          </section>

          {/* Section 2: Match Conduct */}
          <section className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic uppercase">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded italic">02</span> On-Field Conduct
            </h2>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex gap-4">🚩 <p><span className="text-white font-bold underline decoration-yellow-400">Zero Tolerance Policy</span> for abusive language, physical violence, or unsporting behavior.</p></li>
              <li className="flex gap-4">🚩 <p>Teams must reach the venue at least <span className="text-white italic">30 minutes</span> before the scheduled match time.</p></li>
              <li className="flex gap-4">🚩 <p>Decision of the <span className="text-white">Match Referees/Umpires</span> will be final and binding for all participating teams.</p></li>
            </ul>
          </section>

          {/* Section 3: Platform Usage */}
          <section className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic uppercase">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded italic">03</span> Community Guidelines
            </h2>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex gap-4">💬 <p>Spamming or posting offensive content in the <span className="text-white">Comments section</span> is strictly prohibited.</p></li>
              <li className="flex gap-4">💬 <p>Respect other athletes and teams. The 'Follow' and 'Like' features are meant to <span className="text-white">build a community</span>, not for harassment.</p></li>
              <li className="flex gap-4">💬 <p>Any issues regarding match results or scores should be reported through the <span className="text-white">Support Email</span> with valid proof.</p></li>
            </ul>
          </section>

        </div>

        {/* Warning Banner */}
        <div className="mt-16 bg-red-600/10 border border-red-600/50 p-8 rounded-3xl text-center">
          <p className="text-red-500 font-black tracking-widest uppercase mb-2">Notice</p>
          <h3 className="text-white text-xl font-bold">Failure to comply with these rules may result in team disqualification and account suspension.</h3>
        </div>
      </div>
    </div>
  );
}

export default Rules;
