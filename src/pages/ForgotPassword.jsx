import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your registered email! 📧");
    
    setLoading(true);
    try {
      // Firebase magic link starts here
      await sendPasswordResetEmail(auth, email);
      setMessageSent(true);
      alert("Reset link sent to your email! 🚀 Check your inbox.");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        alert("This email is not registered with us! ❌");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
      <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-800 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full"></div>

        <h2 className="text-3xl font-black italic text-yellow-400 uppercase mb-4 tracking-tighter">
          Reset Password
        </h2>
        
        {!messageSent ? (
          <form onSubmit={handleReset} className="space-y-6">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
              Enter your registered email to receive a secure password reset link.
            </p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase ml-2">Email Address</label>
              <input 
                type="email"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold transition-all"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? "Syncing..." : "Send Reset Link 🔗"}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="text-5xl">📩</div>
            <p className="text-slate-300 font-bold italic">Check your inbox! We've sent a recovery link to <span className="text-yellow-400">{email}</span></p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase text-xs"
            >
              Back to Login
            </button>
          </div>
        )}

        {!messageSent && (
          <button 
            onClick={() => navigate('/login')} 
            className="w-full text-slate-600 mt-6 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            ← Cancel & Go Back
          </button>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;
