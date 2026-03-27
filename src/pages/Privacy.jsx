import React from 'react';

function Privacy() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect essential information such as your Team Name, Captain's Name, Email, and Mobile Number to facilitate match coordination and team registrations."
    },
    {
      title: "Information Sharing",
      content: "When you 'Enroll' in a match, your contact details are shared ONLY with the host of that specific match to help them contact you for tournament details."
    },
    {
      title: "Public Profile",
      content: "Your team profile, including posts, likes, and comments, is visible to other registered users to foster a transparent and social sports community."
    },
    {
      title: "Data Security",
      content: "We use Firebase's secure infrastructure to protect your authentication data. We do not sell your personal information to third-party advertisers."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Hero Header */}
      <div className="pt-32 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest mb-6">
            Privacy Matters
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter mb-4 uppercase">
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-bold max-w-2xl uppercase tracking-widest">
            How we protect your data at LET'S PLAY.
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-16">
          {sections.map((item, index) => (
            <div key={index} className="group">
              <h2 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tight flex items-center gap-4">
                <span className="h-px w-8 bg-yellow-400"></span> {item.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium pl-12">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Note */}
        <div className="mt-24 p-10 bg-slate-900/50 rounded-3xl border border-slate-900 text-center">
          <p className="text-slate-500 font-bold uppercase tracking-widest mb-4">Have Questions?</p>
          <h3 className="text-white text-xl font-bold">Contact our privacy team at <span className="text-yellow-400 italic">privacy@letsplay.com</span></h3>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
