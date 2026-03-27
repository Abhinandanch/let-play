import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function Feedback() {
  // Variable names ko small letter mein rakha hai taaki niche error na aaye
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetching Feedbacks in Real-time
  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handling Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if name and message exist
    if(!formData.name || !formData.message) return;
    
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: formData.name,
        message: formData.message,
        timestamp: serverTimestamp(),
      });
      setFormData({ name: '', message: '' });
      alert("Feedback posted successfully! 🏆");
    } catch (error) {
      console.error("Error adding feedback: ", error);
      alert("Error adding feedback. Check console.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Feedback Form Section --- */}
        <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 mb-16 shadow-2xl">
          <h1 className="text-4xl font-black text-yellow-400 italic mb-2 uppercase tracking-tighter">Community Voice</h1>
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Share your experience with LET'S PLAY</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="Your Name / Team Name" required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-yellow-400 outline-none font-bold text-white"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <textarea 
              placeholder="What's on your mind? (e.g. Loved the last tournament! / Found a bug in dashboard)" rows="3" required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-yellow-400 outline-none font-bold text-white"
              value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
            <button type="submit" className="bg-yellow-400 text-slate-950 px-8 py-3 rounded-xl font-black uppercase italic hover:scale-105 transition-transform">
              Post Feedback ⚡
            </button>
          </form>
        </div>

        {/* --- Public Feedback Feed --- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
            <span className="w-10 h-[2px] bg-yellow-400"></span> Recent Feedbacks
          </h2>

          {loading ? (
            <p className="text-slate-600 animate-pulse font-bold">Loading the wall...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbacks.map((item) => (
                <div key={item.id} className="bg-slate-900/20 p-6 rounded-2xl border border-slate-900 hover:border-slate-800 transition-colors">
                  <h4 className="text-yellow-400 font-black uppercase text-sm mb-2 tracking-tighter">
                    {item.name}
                  </h4>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    "{item.message}"
                  </p>
                  <p className="text-[10px] text-slate-600 font-bold mt-4 uppercase tracking-widest">
                    {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : "Just now"}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {feedbacks.length === 0 && !loading && (
            <p className="text-slate-500 italic">No feedbacks yet. Be the first one to post!</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Feedback;
