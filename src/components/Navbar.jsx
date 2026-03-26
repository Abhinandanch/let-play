import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [userTeam, setUserTeam] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Check shuru hote hi loading true
      if (user) {
        // 1. Pehle Auth se naam uthao (Turant dikhega)
        setUserTeam(user.displayName || "Team");

        // 2. Fir Firestore se role aur detail lao
        try {
          const docRef = doc(db, "teams", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setUserTeam(data.teamName || user.displayName); // Agar DB mein alag naam hai toh wo
          }
        } catch (err) {
          console.error("Navbar Error:", err);
        }
      } else {
        setUserTeam(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="w-full p-6 flex justify-between items-center bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
      <Link to="/" className="text-3xl font-black text-yellow-400 italic tracking-tighter">
        LET'S PLAY
      </Link>

      <div className="flex items-center gap-4">
        {/* Loading hatne ke baad hi UI dikhao */}
        {!loading && (
          userTeam ? (
            <div className="flex items-center gap-4 md:gap-6">
              {userData?.role === 'admin' && (
                <Link to="/admin-control-panel" className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                  🛡️ ADMIN
                </Link>
              )}

              <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-yellow-400 transition-colors uppercase tracking-widest hidden lg:block">
                Welcome, <span className="text-yellow-400">{userTeam}</span> 🏆
              </Link>

              <button 
                onClick={() => signOut(auth).then(() => navigate('/'))}
                className="bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white font-bold px-3 py-2 uppercase text-xs">
                Login
              </button>
              {/* path ko /signup se badal kar /register kar dena agar App.jsx mein wahi hai */}
              <button 
                onClick={() => navigate('/register')} 
                className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] md:text-xs hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Registration
              </button>
            </div>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
