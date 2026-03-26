import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth"; // signOut add kiya
import { doc, setDoc } from "firebase/firestore";

function RegisterTeam() {
  const { gameId } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    teamName: '', captainName: '', phone: '', location: '', email: '', password: ''  
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try { 
      // 1. User Create karna
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Profile update (Captain Name save karna)
      await updateProfile(user, { displayName: formData.captainName });

      // 3. Firestore mein data save karna
      await setDoc(doc(db, "teams", user.uid), {
        uid: user.uid, 
        teamName: formData.teamName, 
        captainName: formData.captainName,
        phone: formData.phone,
        location: formData.location,
        email: formData.email,
        createdAt: new Date()
      }); 

      // 4. Enrollment logic (Same as before)
      if (gameId && gameId !== "undefined") {
        const enrollId = `${gameId}_${user.uid}`; 
        await setDoc(doc(db, "enrollments", enrollId), {
          matchId: gameId, teamId: user.uid, teamName: formData.teamName,
          captainName: formData.captainName, phone: formData.phone,
          status: "pending", enrolledAt: new Date()
        });
      }

      // UPDATE: Registration ke baad turant Logout karna 
      // taaki Navbar mein naam na dikhe aur user ko login karna pade
      await signOut(auth);

      alert(`Registration Successful! Please login to continue.`);
      
      // Login page par bhej dena
      navigate('/login');  

    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally { setLoading(false); } 
  };

  // ... (Baaki niche ka UI bilkul waisa hi rahega jaisa aapka tha)
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic text-yellow-400 uppercase tracking-tighter">
          {gameId ? `${gameId} Entry` : "Team Registration"}
        </h1> 
      </header>

      <div className="w-full max-w-xl bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Name</label>
            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="e.g. Ranchi Warriors" onChange={(e) => setFormData({...formData, teamName: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Captain Name</label>
            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="Full Name" onChange={(e) => setFormData({...formData, captainName: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
            <input type="tel" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="10-digit number" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="City, State" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input type="email" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="team@email.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input type="password" required className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400" placeholder="Min 6 chars" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div> 

          <button type="submit" disabled={loading}
            className="md:col-span-2 w-full bg-yellow-400 text-black font-black p-5 rounded-2xl hover:bg-white active:scale-95 transition-all shadow-xl shadow-yellow-400/20 uppercase tracking-widest mt-4"
          >
            {loading ? "Registering..." : "Register & Join"}
          </button>
        </form>
      </div>
    </div> 
  );
}

export default RegisterTeam;
