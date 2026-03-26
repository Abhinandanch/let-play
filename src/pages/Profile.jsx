import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  doc, getDoc, collection, query, where, onSnapshot, 
  getDocs, orderBy, deleteDoc, setDoc 
} from "firebase/firestore";

function Profile() {
  const { userId } = useParams(); 
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "teams", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }

        const q = query(
          collection(db, "announcements"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        setUserPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    // --- REAL-TIME FOLLOWERS & FOLLOWING COUNT ---
    const unsubFollowers = onSnapshot(query(collection(db, "follows"), where("followingId", "==", userId)), (snap) => {
      setFollowersCount(snap.size);
      if (auth.currentUser) {
        const alreadyFollowing = snap.docs.some(doc => doc.data().followerId === auth.currentUser.uid);
        setIsFollowing(alreadyFollowing);
      }
    });

    const unsubFollowing = onSnapshot(query(collection(db, "follows"), where("followerId", "==", userId)), (snap) => {
      setFollowingCount(snap.size);
    });

    fetchProfileAndPosts();
    return () => { unsubFollowers(); unsubFollowing(); };
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!auth.currentUser) return navigate('/login');
    const followId = `${auth.currentUser.uid}_${userId}`;
    const followRef = doc(db, "follows", followId);
    try {
      if (isFollowing) {
        await deleteDoc(followRef);
      } else {
        await setDoc(followRef, {
          followerId: auth.currentUser.uid,
          followingId: userId,
          timestamp: new Date()
        });
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-400 font-black uppercase italic animate-pulse">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="h-48 bg-gradient-to-r from-slate-900 to-yellow-400/10 border-b border-slate-800 relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-black/50 p-3 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all">← BACK</button>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="-mt-20 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-slate-900 bg-slate-800 shadow-xl flex items-center justify-center">
  {profileData?.profilePic ? (
    <img 
      src={profileData.profilePic} 
      className="w-full h-full object-cover" 
      alt="Team Logo" 
    />
  ) : (
    /* Bada Emoji Placeholder jo hamesha load hoga */
    <span className="text-6xl select-none" role="img">
      👻
    </span>
  )}
</div>


            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black italic uppercase text-white leading-none mb-2">{profileData?.teamName || "Anonymous Team"}</h1>
              <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">Captain: {profileData?.captainName}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-black uppercase text-slate-500">
                <span>📍 {profileData?.location}</span>
                <span>📞 {profileData?.phoneNumber}</span>
              </div>
            </div>

            {auth.currentUser?.uid !== userId && (
              <button 
                onClick={handleFollowToggle}
                className={`${isFollowing ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-yellow-400 text-black hover:bg-white'} px-8 py-4 rounded-2xl font-black uppercase transition-all shadow-lg shadow-yellow-400/10`}
              >
                {isFollowing ? "✓ Following" : "Follow Team"}
              </button>
            )}
          </div>

          <div className="flex justify-around md:justify-start md:gap-12 mt-10 pt-8 border-t border-slate-800/50">
            <div className="text-center md:text-left">
              <p className="text-2xl font-black italic text-white">{userPosts.length}</p>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Posts</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-black italic text-white">{followersCount}</p>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Followers</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-black italic text-white">{followingCount}</p>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Following</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black italic uppercase mb-8 border-l-4 border-yellow-400 pl-4">Team Feed</h2>
          {userPosts.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {userPosts.map(post => (
                <div key={post.id} className="break-inside-avoid bg-slate-900/50 p-5 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-all">
                   {post.postImage && <img src={post.postImage} className="w-full rounded-2xl mb-4 object-cover" alt={post.title} />}
                   <h3 className="text-xl font-black uppercase italic mb-2">{post.title}</h3>
                   <p className="text-slate-400 text-xs line-clamp-2">{post.description}</p>
                   <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase text-yellow-400/50">
                      <span>{post.category}</span>
                      <span>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : ''}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800">
              <p className="text-slate-500 font-bold uppercase italic tracking-widest">No Posts Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Profile;
