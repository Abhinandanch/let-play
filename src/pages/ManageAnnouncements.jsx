import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function ManageAnnouncements() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/login');

      const q = query(collection(db, "announcements"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyPosts(posts);
      setLoading(false);
    };
    fetchPosts();
  }, [navigate]);

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post permanently?")) {
      await deleteDoc(doc(db, "announcements", postId));
      setMyPosts(myPosts.filter(p => p.id !== postId));
      alert("Post Deleted! 🗑️");
    }
  };

  if (loading) return <div className="text-white p-10 text-center uppercase font-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-yellow-400 italic uppercase">My Announcements</h1>
          <button onClick={() => navigate('/dashboard')} className="text-xs font-black uppercase bg-slate-800 px-4 py-2 rounded-xl">🔙 Back</button>
        </div>

        <div className="space-y-4">
          {myPosts.length === 0 ? <p className="text-slate-500 font-bold">No announcements yet.</p> : 
            myPosts.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                   {post.postImage && <img src={post.postImage} className="w-16 h-16 rounded-xl object-cover" alt="post" />}
                   <div>
                     <h3 className="font-black text-lg text-white uppercase italic">{post.title}</h3>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">📅 {post.eventDate || "No Date"} | 📍 {post.location}</p>
                   </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/edit-post/${post.id}`)} 
                    className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Edit ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-600/20 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default ManageAnnouncements;
