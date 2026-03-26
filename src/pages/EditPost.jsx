import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

function EditPost() {
  const { postId } = useParams(); // URL se ID nikalne ke liye
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Nayi image store karne ke liye
const [previewUrl, setPreviewUrl] = useState(""); // Purani ya nayi photo dikhane ke liye
const [showFullImage, setShowFullImage] = useState(false);

  const [announcement, setAnnouncement] = useState({
    title: '',
    category: 'Cricket',
    location: '',
    description: '',
    eventDate: ''
  });

  // 1. Purana Data Fetch karein jab page load ho
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const docRef = doc(db, "announcements", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnnouncement(docSnap.data());
          setPreviewUrl(docSnap.data().postImage); 
        } else {
          alert("Post not found!");
          navigate('/manage-announcements');
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  // 2. Update Function (Firebase mein save karne ke liye)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
          let finalImageUrl = announcement.postImage; // Default: purani image

    // Agar user ne nayi file select ki hai
    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "letsplay_uploads");

      const res = await fetch("https://api.cloudinary.com/v1_1/djdzzp1wx/image/upload", {
        method: "POST",
        body: data,
      });
      
      const fileData = await res.json();
      finalImageUrl = fileData.secure_url; // Nayi image ka URL
    }
      const docRef = doc(db, "announcements", postId);
      await updateDoc(docRef, {
        title: announcement.title,
        category: announcement.category,
        location: announcement.location,
        description: announcement.description,
        eventDate: announcement.eventDate,
        postImage: finalImageUrl,
      });

      alert("Post Updated Successfully! ✅");
      navigate('/manage-announcements'); // Wapas list page par bhej dein
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update post.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-white p-20 text-center font-black italic">Loading Post Data...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-black text-yellow-400 italic uppercase mb-8 flex items-center gap-3">
          ✏️ Edit Announcement
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold"
              value={announcement.title} 
              onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold appearance-none cursor-pointer"
                value={announcement.category} 
                onChange={(e) => setAnnouncement({...announcement, category: e.target.value})}
              >
                <option value="Cricket">Cricket 🏏</option>
                <option value="Football">Football ⚽</option>
                <option value="Kabaddi">Kabaddi 🤼</option>
                <option value="Free Fire">Free Fire 🔥</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Date</label>
              <input 
                type="date"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold text-white"
                value={announcement.eventDate} 
                onChange={(e) => setAnnouncement({...announcement, eventDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold"
              value={announcement.location} 
              onChange={(e) => setAnnouncement({...announcement, location: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold"
              value={announcement.description} 
              onChange={(e) => setAnnouncement({...announcement, description: e.target.value})}
            />
          </div>
 {/* 1. Preview Section (Click to Full Screen) */}
{previewUrl && (
  <div className="relative group cursor-pointer mb-4" onClick={() => setShowFullImage(true)}>
    <img 
      src={previewUrl} 
      className="w-full h-48 bg-slate-800 rounded-2xl border border-slate-700 object-contain p-2 transition-all hover:scale-[1.02]" 
      alt="preview" 
    />
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl transition-all">
       <span className="text-[10px] font-black uppercase tracking-widest text-white">Click to Enlarge 🔍</span>
    </div>
  </div>
)}

{/* 2. Photo Change Button (Ye missing tha shayad) */}
<div className="space-y-2 mb-6">
  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">
    📸 Select New Photo
  </label>
  <input 
    type="file" 
    accept="image/*"
    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-yellow-400 file:text-black cursor-pointer hover:file:bg-white transition-all"
    onChange={(e) => {
      const file = e.target.files[0]; // Pehli file select karein
      if (file) {
        setImageFile(file); // Cloudinary ke liye state update
        setPreviewUrl(URL.createObjectURL(file)); // UI ke liye preview update
      }
    }}
  />
</div>

{/* 3. Modal (Ise Form ke end mein ya bahar rakhein) */}
{showFullImage && (
  <div 
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
    onClick={() => setShowFullImage(false)}
  >
    <img 
      src={previewUrl} 
      className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-200"
      alt="Full View" 
    />
    <button className="absolute top-10 right-10 text-white text-4xl font-light">×</button>
  </div>
)}



          <div className="flex gap-4 pt-4">
       
            <button 
              type="button" 
              onClick={() => navigate('/manage-announcements')}
              className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={updating}
              className="flex-1 bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
