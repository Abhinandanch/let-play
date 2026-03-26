import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() { 
  const [userName, setUserName] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); 
      if (user) {
        setUserName(user.displayName || "User");
        try {
          const docRef = doc(db, "teams", user.uid); 
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setUserName(data.captainName || user.displayName);
          }
        } catch (err) { console.error(err); } 
      } else {
        setUserName(null);
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
      
      <div className="flex items-center gap-2 md:gap-4">
        {!loading && ( userName ? (
            <div className="flex items-center gap-2 md:gap-6">
              
              {/* Admin login par sirf icon dikhega mobile par */}
              {userData?.role === 'admin' && (
                <Link to="/admin-control-panel" className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-2 md:px-4 md:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                  <span className="md:hidden">🛡️</span>
                  <span className="hidden md:inline">🛡️ ADMIN</span>
                </Link>
              )}

              {/* Dynamic Name Display Logic */}
              <Link to="/dashboard" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-yellow-400 transition-colors uppercase tracking-widest">
                {userData?.role === 'admin' ? (
                  // Agar ADMIN hai toh mobile par sirf Welcome
                  <>
                    <span className="md:hidden">Welcome 🏆</span>
                    <span className="hidden md:inline">Welcome, <span className="text-yellow-400">{userName}</span> 🏆</span>
                  </>
                ) : (
                  // Agar NORMAL USER hai toh mobile par bhi PURA NAAM dikhega
                  <span>Welcome, <span className="text-yellow-400">{userName}</span> 🏆</span>
                )}
              </Link>

              <button 
                onClick={() => signOut(auth).then(() => navigate('/'))}
                className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold hover:bg-red-500 hover:text-white transition-all" >
                LOGOUT
              </button> 
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-white font-bold px-3 py-2 uppercase text-xs">Login</button>
              <button onClick={() => navigate('/register')} className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black uppercase text-[10px] hover:bg-white transition-all">Signup</button>   
            </div>    
          )   
        )} 
      </div> 
    </nav> 
  );
}

export default Navbar;
