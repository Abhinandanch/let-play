import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const q = query(
        collection(db, "enrollments"), 
        where("ownerId", "==", user.uid), 
        where("status", "in", ["pending", "selected"])
      ); 

      const unsubscribeSnap = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setEnrollments(data);
        setLoading(false);
      }, (error) => {
        console.error("Firestore Error:", error);
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Status badalne ke liye common function
  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "enrollments", id), { status: newStatus });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Kya aap is team ko list se hatana chahte hain?")) {
      updateStatus(id, 'rejected');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black italic text-yellow-400 uppercase tracking-tighter">
            Enrollment Members 🏆
          </h1>
          <button onClick={() => navigate(-1)} className="bg-slate-800 px-6 py-2 rounded-xl font-bold text-xs hover:bg-slate-700 transition-all uppercase tracking-widest border border-slate-700">
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse font-mono">Syncing Data...</p>
        ) : enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
              <thead className="bg-slate-800 text-yellow-400 uppercase text-[10px] tracking-widest font-black border-b border-slate-700">
                <tr>
                  <th className="p-6">Team Name</th>
                  <th className="p-6">Captain Name</th>
                  <th className="p-6">Mobile Number</th>
                  <th className="p-6 text-center">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {enrollments.map((en) => (
                  <tr key={en.id} className={`hover:bg-slate-800/50 transition-all ${en.status === 'selected' ? 'bg-green-500/5' : ''}`}>
                    <td className="p-6">
                      <div className="text-white font-black uppercase italic">{en.teamName || "N/A"}</div>
                      <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter italic">Match ID: {en.matchId || "N/A"}</div>
                    </td>
                    <td className="p-6 text-slate-400 font-bold uppercase text-xs">{en.captainName || "Not Provided"}</td>
                    <td className="p-6 text-yellow-400 font-mono font-bold tracking-tighter">{en.phone || "No Contact"}</td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        {en.status === 'selected' ? (
                          /* Naya Update: Selected tag ab clickable hai */
                          <button 
                            onClick={() => updateStatus(en.id, 'pending')}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400/30 transition-all flex items-center gap-2 group"
                            title="Click to Unselect"
                          >
                            SELECTED ✅
                            <span className="hidden group-hover:inline text-[8px]">(Undo)</span>
                          </button>
                        ) : (
                          <>
                            <button onClick={() => updateStatus(en.id, 'selected')} className="w-10 h-10 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all font-bold">✓</button>
                            <button onClick={() => handleReject(en.id)} className="w-10 h-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all font-bold">✕</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-500 text-xl font-bold uppercase italic tracking-widest">No Requests Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Enrollments;
