import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' ya 'teams'
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Real-time Data Fetch (Posts aur Teams dono)
  useEffect(() => {
    // Posts Fetch
    const unsubPosts = onSnapshot(collection(db, "announcements"), (snap) => {
      setAllPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Teams Fetch
    const unsubTeams = onSnapshot(collection(db, "teams"), (snap) => {
      setAllTeams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubPosts(); unsubTeams(); };
  }, []);

  // 2. Smart Search Filter (Location, Team, Sport, Captain - Sab ke liye)
  const filteredPosts = allPosts.filter(post => 
    post.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = allTeams.filter(team => 
    team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Admin Actions (Delete Post)
  const handlePostDelete = async (id) => {
    if (window.confirm("🛡️ Admin: Kya aap is POST ko permanently delete karna chahte hain?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
        alert("Post Deleted! 🗑️");
      } catch (err) { alert("Error deleting post"); }
    }
  };

  // 4. Admin Actions (Delete Team/User ID)
  const handleTeamDelete = async (id, teamName) => {
    if (window.confirm(`🛡️ Admin: Kya aap Team "${teamName}" ki ID aur Account delete karna chahte hain?`)) {
      try {
        await deleteDoc(doc(db, "teams", id));
        alert("Team ID Removed! 🗑️");
      } catch (err) { alert("Error deleting team"); }
    }
  };

  if (loading) return <div className="text-white p-20 text-center font-black italic animate-pulse">Loading Global Data...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black text-yellow-400 italic uppercase tracking-tighter">Super Admin 🛡️</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Master Control Panel</p>
          </div>
          
          {/* Smart Search Bar */}
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder={activeTab === 'matches' ? "Search Sport, City, Team..." : "Search Team, Captain, Phone..."}
              className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold transition-all placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => { setActiveTab('matches'); setSearchTerm(''); }}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'matches' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            All Matches ({allPosts.length})
          </button>
          <button 
            onClick={() => { setActiveTab('teams'); setSearchTerm(''); }}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'teams' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            All Teams ({allTeams.length})
          </button>
        </div>

        {/* TAB 1: ALL MATCHES */}
        {activeTab === 'matches' && (
  <div className="space-y-4">
    {filteredPosts.map(post => (
      <div key={post.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-yellow-400/30 transition-all group">
        
        {/* Clickable Area: Title ya Image pe click karne se Post Detail page khulega */}
        <div 
          onClick={() => navigate(`/post/${post.id}`)} // <-- Apna Post Detail Route check karein
          className="flex items-center gap-6 w-full cursor-pointer"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-700 group-hover:scale-105 transition-transform">
            <img src={post.postImage || 'https://placehold.co'} className="w-full h-full object-cover" alt="match" />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest italic">{post.category || "General"}</div>
            <h3 className="font-black text-lg text-white uppercase italic leading-none group-hover:text-yellow-400 transition-colors">{post.title}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">📍 {post.location} | 🛡️ {post.teamName}</p>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handlePostDelete(post.id); }} // stopPropagation zaroori hai taaki navigate na ho jaye
          className="w-full md:w-auto bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl"
        >
          Remove Post 🗑️
        </button>
      </div>
    ))}
  </div>
)}

        {/* TAB 2: ALL TEAMS */}
      {activeTab === 'teams' && (
  <div className="space-y-4">
    {filteredTeams.map(team => (
      <div key={team.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-400/30 transition-all group">
        
        {/* Clickable Area: Team name pe click karne se Team Profile page khulega */}
        <div 
         onClick={() => navigate(`/admin/team-profile/${team.id}`)} // <-- Apna Team Profile Route check karein (team.id ya team.uid)
          className="w-full cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-xl text-white uppercase italic group-hover:text-yellow-400 transition-colors">{team.teamName}</h3>
            <span className="text-[8px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase font-black tracking-widest">ID: {team.id?.slice(-6)}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div>
              <p className="text-slate-600 text-[8px] font-black uppercase tracking-tighter">Captain</p>
              <p className="text-xs font-bold text-slate-300">{team.captainName || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-600 text-[8px] font-black uppercase tracking-tighter">Contact</p>
              <p className="text-xs font-bold text-yellow-400">{team.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-600 text-[8px] font-black uppercase tracking-tighter">Location</p>
              <p className="text-xs font-bold text-slate-300">{team.location || "N/A"}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-slate-600 text-[8px] font-black uppercase tracking-tighter">Email</p>
              <p className="text-[10px] font-bold text-slate-500 truncate w-32">{team.email || "N/A"}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handleTeamDelete(team.id, team.teamName); }}
          className="w-full md:w-auto bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
        >
          Ban Team 🚫
        </button>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}

export default AdminDashboard;
