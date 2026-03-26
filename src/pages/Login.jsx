import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';

// 1. Sabse pehle function declare karein
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 2. handleLogin ko function ke ANDAR rakhein
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in!");
      navigate('/'); 
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  // 3. Return statement (UI) zaroori hai
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
        <h1 className="text-4xl font-black text-yellow-400 mb-6 italic uppercase text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" required
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl focus:border-yellow-400 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" required
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl focus:border-yellow-400 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p 
  onClick={() => navigate('/forgot-password')} 
  className="text-right text-slate-500 text-[10px] font-black uppercase cursor-pointer hover:text-yellow-400 transition-colors mt-2"
>
  Forgot Password? 🔓
</p>
          </div>
          <button type="submit" className="w-full bg-yellow-400 text-black font-black p-5 rounded-2xl hover:bg-yellow-300 uppercase tracking-widest mt-4">
            Sign In 🔓
          </button>
        </form>
        <p className="text-center mt-6 text-slate-400">
          New team? <Link to="/" className="text-yellow-400 font-bold underline">Register Here</Link>
        </p>
      </div>
    </div>
  );
} // <--- Function yahan khatam hona chahiye

export default Login;