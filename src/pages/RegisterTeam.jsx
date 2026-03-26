import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, updateProfile, signOut, RecaptchaVerifier, signInWithPhoneNumber 
} from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";

function RegisterTeam() {
  const { gameId } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState({ 
    teamName: '', captainName: '', phone: '', location: '', email: '', password: ''  
  });

  const setupRecaptcha = () => { 
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', 
        'callback': (response) => { console.log("Recaptcha verified"); }
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) return alert("Please enter a valid 10-digit number");
    setLoading(true);
    try {
      setupRecaptcha();
      const phoneNumber = "+91" + formData.phone;
      const appVerifier = window.recaptchaVerifier; 
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      alert("OTP Sent! Check your phone 📱"); 
    } catch (error) { 
      console.error("SMS Error:", error);
      alert("Failed to send OTP: " + error.message);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally { setLoading(false); }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try { 
      // 1. OTP verify karein
      if (!confirmationResult) {
        alert("OTP request expired. Please resend.");
        setLoading(false); 
        return;
      }
      await confirmationResult.confirm(otp);

      // 2. Email account banayein
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 3. Profile update karein
      await updateProfile(user, { displayName: formData.teamName || "Team" });

      // 4. Data Variables
      const finalTeamName = formData.teamName || "Unnamed Team";
      const finalCaptain = formData.captainName || "No Name";
      const finalPhone = formData.phone || "0000000000";

      // 5. Database mein Team Profile save karein
      await setDoc(doc(db, "teams", user.uid), {
        uid: user.uid, 
        teamName: finalTeamName, 
        captainName: finalCaptain,
        phone: finalPhone,
        location: formData.location || "Not Provided",
        email: formData.email,
        createdAt: new Date()
      }); 

      // 6. ENROLLMENT LOGIC
      if (gameId && gameId !== "undefined") {
        const enrollId = `${gameId}_${user.uid}`; 
        await setDoc(doc(db, "enrollments", enrollId), {
          matchId: gameId, 
          teamId: user.uid, 
          teamName: finalTeamName,
          captainName: finalCaptain, 
          phone: finalPhone,
          status: "pending", 
          enrolledAt: new Date()
        });
      }

      alert(`Success! Team ${finalTeamName} registered.`);
      await signOut(auth);  
      navigate('/');  
    } catch (error) {
      console.error("Critical Error:", error);
      alert("Error: " + error.message);
    } finally { setLoading(false); } 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center">
      <div id="recaptcha-container"></div> 
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black italic text-yellow-400 uppercase tracking-tighter">
          {gameId ? `${gameId} Entry` : "Team Registration"}
        </h1> 
        <p className="text-gray-400 mt-2">Verify phone & create your profile</p> 
      </header>
      <div className="w-full max-w-xl bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <form onSubmit={!isOtpSent ? handleSendOtp : handleVerifyAndRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Name</label>
            <input type="text" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="e.g. Ranchi Warriors" onChange={(e) => setFormData({...formData, teamName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Captain Name</label>
            <input type="text" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="Full Name" onChange={(e) => setFormData({...formData, captainName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
            <input type="tel" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="10-digit number" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
            <input type="text" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="City, State" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input type="email" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="team@email.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input type="password" required disabled={isOtpSent} className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 disabled:opacity-50" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div> 
          {isOtpSent && (
            <div className="md:col-span-2 space-y-2 bg-yellow-400/5 p-6 rounded-3xl border border-yellow-400/20 mt-4 animate-pulse">
              <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
              <input type="text" required maxLength="6"
                className="w-full bg-slate-900 border border-yellow-400 p-4 rounded-2xl outline-none text-center text-2xl tracking-[0.5em] font-black text-white"
                placeholder="000000" onChange={(e) => setOtp(e.target.value)}/>
            </div> 
          )}
          <button type="submit" disabled={loading}
            className="md:col-span-2 w-full bg-yellow-400 text-black font-black p-5 rounded-2xl hover:bg-white active:scale-95 transition-all shadow-xl shadow-yellow-400/20 uppercase tracking-widest mt-4 disabled:opacity-50"
          >{loading ? "Processing..." : isOtpSent ? "Verify & Register Team" : "Send Verification OTP"}
          </button>
        </form> 
      </div>
    </div>
  );
}

export default RegisterTeam;

