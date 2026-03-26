import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function FinishRegistration() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Verifying your link... ⏳");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check karo ki kya user email link se aaya hai
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      
      // Agar browser mein email nahi mila (kisi ne dusre browser se link khola)
      if (!email) {
        email = window.prompt('Verification ke liye apna Email dobara enter karein:');
      }

      if (email) {
        setStatus("Email Verified! ✅ Ab apna password set karein.");
      } else {
        setStatus("Email missing. Please try registration again. ❌");
      }
    } else {
      setStatus("Invalid or expired link. ❌");
    }
  }, []);

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (password.length < 6) return alert("Password kam se kam 6 characters ka hona chahiye! 🔐");
    
    setLoading(true);
    try {
      const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Confirm Email:');

      // 2. Email link se user ko Login karwao
      const result = await signInWithEmailLink(auth, email, window.location.href);
      const user = result.user;

      // 3. User ka naya Password set karo
      await updatePassword(user, password);

      // 4. Pending data se actual data fetch karo
      const tempId = email.replace(/\./g, '_');
      const tempDocRef = doc(db, "pending_registrations", tempId);
      const tempSnap = await getDoc(tempDocRef);

      if (tempSnap.exists()) {
        const registrationData = tempSnap.data();

        // 5. Final 'teams' collection mein data save karo
        await setDoc(doc(db, "teams", user.uid), {
          uid: user.uid,
          teamName: registrationData.teamName,
          captainName: registrationData.captainName,
          phone: registrationData.phone,
          location: registrationData.location,
          email: registrationData.email,
          status: 'active',
          verifiedAt: new Date()
        });

        // 6. Agar gameId tha toh Enrollment complete karo
        if (registrationData.gameId && registrationData.gameId !== "NoGame") {
          const enrollId = `${registrationData.gameId}_${user.uid}`;
          await setDoc(doc(db, "enrollments", enrollId), {
            matchId: registrationData.gameId,
            teamId: user.uid,
            teamName: registrationData.teamName,
            phone: registrationData.phone,
            status: "pending",
            enrolledAt: new Date()
          });
        }

        // 7. Purana temporary data delete kar do
        await deleteDoc(tempDocRef);
      }

      // Cleanup
      window.localStorage.removeItem('emailForSignIn');
      alert("Registration Successful! ✅ Aapka account activate ho gaya hai.");
      navigate('/login');

    } catch (error) {
      console.error("Finish Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-yellow-400 uppercase italic tracking-tighter">Set Password</h2>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">{status}</p>
        </div>

        {/* Form tabhi dikhega jab link valid ho */}
        {isSignInWithEmailLink(auth, window.location.href) && (
          <form onSubmit={handleCompleteRegistration} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 text-white"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-black p-5 rounded-2xl hover:bg-white active:scale-95 transition-all shadow-xl shadow-yellow-400/20 uppercase tracking-widest"
            >
              {loading ? "Activating Account..." : "Confirm & Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FinishRegistration;
