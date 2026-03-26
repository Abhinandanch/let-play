import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection, onSnapshot, query, orderBy, doc, getDoc,
  setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, where
} from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [followedTeams, setFollowedTeams] = useState([]); // Track user's following list
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);

  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [enrolledMatches, setEnrolledMatches] = useState([]); // Track user's enrollment list
  const gameFilter = new URLSearchParams(search).get('game');

  const sportsCategories = [
    { name: 'Cricket', icon: '🏏' },
    { name: 'Football', icon: '⚽' },
    { name: 'Volleyball', icon: '🏐' }, // Naya Shortcut
    { name: 'Kabaddi', icon: '🤼' },
    { name: 'Free Fire', icon: '🔥' },
    { name: 'PUBG', icon: '🔫' },       // Naya Shortcut
    // Naya Shortcut (Manual entries ke liye)
  ];

  const filteredPosts = posts.filter(post => {
    // 1. SMART SEARCH: Location, Title ya Category mein se kuch bhi match kare
    const matchesSearch =
      post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.otherSportName?.toLowerCase().includes(searchTerm.toLowerCase()); // Other wala manual name

    // 2. Icon/URL Filter
    let matchesGame = true;
    if (gameFilter && gameFilter !== "All") {
      matchesGame = post.category?.toLowerCase() === gameFilter.toLowerCase();
    }

    return matchesSearch && matchesGame;
  });


  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);
  //Enrollment
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "enrollments"), where("teamId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEnrolledMatches(snapshot.docs.map(doc => doc.data().matchId));
    });
    return () => unsubscribe();
  }, []);


  // --- 1. DYNAMIC LOGO & POSTS FETCHING ---
  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const postsWithLogos = await Promise.all(announcements.map(async (post) => {
        if (post.userId) {
          const teamRef = doc(db, "teams", post.userId);
          const teamSnap = await getDoc(teamRef);
          if (teamSnap.exists()) {
            return { ...post, teamLogo: teamSnap.data().profilePic };
          }
        }
        return post;
      }));

      let data = postsWithLogos;
      if (gameFilter) {
        data = data.filter(post => post.category === gameFilter);
      }
      setPosts(data);
    });
    return () => unsubscribe();
  }, [gameFilter]);

  // --- 2. FOLLOW STATUS TRACKER ---
  useEffect(() => {
    if (!auth.currentUser) {
      setFollowedTeams([]);
      return;
    }
    const q = query(collection(db, "follows"), where("followerId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const followingIds = snapshot.docs.map(doc => doc.data().followingId);
      setFollowedTeams(followingIds);
    });
    return () => unsubscribe();
  }, [auth.currentUser]);

  // --- 3. FOLLOW/UNFOLLOW TOGGLE FUNCTION ---
  const handleFollowToggle = async (e, targetUserId) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      alert("Please login to follow teams! 🛡️");
      navigate('/login');
      return;
    }

    if (!targetUserId || targetUserId === "undefined") return alert("Team data missing!");

    const followId = `${auth.currentUser.uid}_${targetUserId}`;
    const followRef = doc(db, "follows", followId);

    try {
      if (followedTeams.includes(targetUserId)) {
        await deleteDoc(followRef); // Unfollow
      } else {
        await setDoc(followRef, {
          followerId: auth.currentUser.uid,
          followingId: targetUserId,
          timestamp: new Date()
        }); // Follow
      }
    } catch (err) { console.error("Follow Error:", err); }
  };

  const handleLike = async (postId, currentLikes = []) => {
    if (!auth.currentUser) return alert("Please login to like! ❤️");
    const user = auth.currentUser;
    const postRef = doc(db, "announcements", postId);
    try {
      if (currentLikes.includes(user.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      }
    } catch (err) { console.error(err); }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    if (!auth.currentUser) return alert("Login to comment! 💬");
    try {
      const postRef = doc(db, "announcements", postId);
      const newComment = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Gamer",
        text: commentText,
        createdAt: new Date()
      };
      await updateDoc(postRef, { comments: arrayUnion(newComment) });
      setCommentText("");
      setActiveCommentBox(null);
    } catch (err) { alert("Error adding comment!"); }
  };

  const handleShare = (post) => {
    const url = `${window.location.origin}/profile/${post.userId}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url: url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link Copied! 🔗");
    }
  };

  // --- Updated Enrollment & Unenroll Logic ---
  const handleEnrollToggle = async (post) => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }

    const enrollId = `${post.id}_${user.uid}`;
    const isAlreadyEnrolled = enrolledMatches.includes(post.id);

    try {
      if (isAlreadyEnrolled) {
        // UNENROLL: Agar pehle se enroll hai toh delete karo
        await deleteDoc(doc(db, "enrollments", enrollId));
        alert("Unenrolled! ❌ Aapka naam list se hat gaya hai.");
      } else {
        // ENROLL: Details fetch karke save karo
        const teamSnap = await getDoc(doc(db, "teams", user.uid));
        if (teamSnap.exists()) {
          const teamData = teamSnap.data();
          await setDoc(doc(db, "enrollments", enrollId), {
            matchId: post.id,
            matchTitle: post.title || "Match",
            ownerId: post.userId, // Post owner ki ID (Filtering ke liye)
            teamId: user.uid,
            teamName: teamData.teamName || "N/A",
            captainName: teamData.captainName || "N/A", // Missing Field Fix
            phone: teamData.phone || "N/A",             // Missing Field Fix
            enrolledAt: new Date(),
            status: "pending"
          });
          alert(`Successfully Enrolled! 🚀`);
        } else {
          navigate('/register'); // Agar profile nahi hai
        }
      }
    } catch (error) {
      alert("Action failed: " + error.message);
    }
  };


  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-8">
          {gameFilter ? <span className="text-yellow-400">{gameFilter}</span> : "All Matches"}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => navigate('/')}
            className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black uppercase transition-all border shadow-lg ${!gameFilter || gameFilter === 'All'
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-yellow-400/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
          >
            🌍 All Matches
          </button>
          {sportsCategories.map((sport) => (
            <button key={sport.name} onClick={() => navigate(`/?game=${sport.name}`)} className={`flex-shrink-0 px-8 py-4 rounded-2xl font-bold uppercase transition-all border ${gameFilter === sport.name ? 'bg-yellow-400 text-black' : 'bg-slate-900 border-slate-800'}`}>
              <span>{sport.icon}</span> {sport.name}
            </button>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by Sport or Location (e.g. Volleyball, Ranchi, PUBG)..."
            className="w-full bg-slate-900 border border-slate-800 p-5 rounded-3xl outline-none focus:border-yellow-400 transition-all font-black text-lg shadow-2xl placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {filteredPosts.map(post => (
            <div key={post.id} className="break-inside-avoid bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 hover:border-yellow-400/50 transition-all flex flex-col mb-8 group">

              {/* TEAM HEADER */}
              <div className="flex items-center justify-between mb-6 bg-slate-800/30 p-3 rounded-3xl cursor-pointer" onClick={() => navigate(`/profile/${post.userId}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-600 group-hover:border-yellow-400 flex items-center justify-center">
                    {post.teamLogo ? (
                      <img
                        src={post.teamLogo}
                        className="w-full h-full object-cover"
                        alt="logo"
                      />
                    ) : (
                      /* Chhota Emoji Placeholder */
                      <span className="text-xl select-none" role="img" aria-label="team-icon">
                        👻
                      </span>
                    )}
                  </div>
                  <h4 className="text-white text-[11px] font-black uppercase italic group-hover:text-yellow-400 transition-colors">{post.teamName}</h4>
                </div>
                {auth.currentUser?.uid !== post.userId && (
                  <button
                    onClick={(e) => handleFollowToggle(e, post.userId)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${followedTeams.includes(post.userId) ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-yellow-400 text-black hover:bg-white'}`}
                  >
                    {followedTeams.includes(post.userId) ? "✓ Following" : "+ Follow"}
                  </button>
                )}
              </div>

              {/* POST CONTENT */}
              {post.postImage && <img src={post.postImage} className="w-full rounded-3xl mb-6 cursor-zoom-in" onClick={() => setSelectedImage(post.postImage)} alt="post" />}

              <h3 className="text-2xl font-black italic uppercase mb-1">{post.title}</h3>
              <div className="mb-2">
                <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg uppercase italic tracking-tighter shadow-lg shadow-yellow-400/20">
                  {/* Agar 'Other' hai toh manual wala naam, varna normal category */}
                  {post.category === 'Other' ? (post.otherSportName || "Other Sport") : post.category} 🏆
                </span>
              </div>

              {/* --- NAYA: EVENT DATE SECTION --- */}
              {post.eventDate && (
                <div className="flex items-center gap-2 mb-4 text-yellow-400 font-black uppercase text-[10px] tracking-widest bg-yellow-400/5 w-fit px-3 py-1.5 rounded-lg border border-yellow-400/10">
                  <span>📅</span> Event Date: {post.eventDate}
                </div>
              )}

              {post.description && <p className="text-slate-400 text-sm mb-6 pl-4 border-l-2 border-slate-800 leading-relaxed">{post.description}</p>}

              {/* INTERACTION BUTTONS */}
              <div className="flex items-center justify-around border-t border-slate-800/50 pt-6 mb-6">
                <button onClick={() => handleLike(post.id, post.likes || [])} className={`flex flex-col items-center gap-1 ${post.likes?.includes(auth.currentUser?.uid) ? 'text-red-500' : 'text-slate-500'}`}>
                  <span className="text-xl">{post.likes?.includes(auth.currentUser?.uid) ? '❤️' : '🤍'}</span>
                  <span className="text-[10px] font-black">{post.likes?.length || 0}</span>
                </button>
                <button onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)} className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-400">
                  <span className="text-xl">💬</span>
                  <span className="text-[10px] font-black">Comment</span>
                </button>
                <button onClick={() => handleShare(post)} className="flex flex-col items-center gap-1 text-slate-500 hover:text-green-400">
                  <span className="text-xl">📤</span>
                  <span className="text-[10px] font-black uppercase">Share</span>
                </button>
              </div>

              {/* COMMENT BOX UI */}
              {activeCommentBox === post.id && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-800 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2 mb-4">
                    <input type="text" placeholder="Add a comment..." className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs outline-none focus:border-yellow-400" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                    <button onClick={() => handleComment(post.id)} className="bg-yellow-400 text-black px-4 rounded-xl text-[10px] font-black uppercase">Post</button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                    {post.comments?.slice(-3).reverse().map((c, i) => (
                      <div key={i} className="bg-slate-900/50 p-2 rounded-lg border border-slate-800"><p className="text-[9px] font-black text-yellow-400 uppercase">{c.userName}</p><p className="text-[11px] text-slate-300">{c.text}</p></div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleEnrollToggle(post)}
                className={`w-full py-4 rounded-2xl font-black uppercase transition-all ${enrolledMatches.includes(post.id)
                  ? "bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white"
                  : "bg-slate-800 hover:bg-yellow-400 hover:text-black text-white"
                  }`}
              >
                {enrolledMatches.includes(post.id) ? "Not Enroll ✕" : "Enroll Now 🚀"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-full rounded-lg object-contain" alt="Full View" />
        </div>
      )}
    </div>
  );
}

export default Home;
