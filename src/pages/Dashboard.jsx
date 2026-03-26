import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase'; //image storage

import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";//imgstorage

function Dashboard() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null); // Naya state image ke liye

  // Announcement State
  const [announcement, setAnnouncement] = useState({ 
    title: '', 
    type: 'Tournament', 
    category: '',
    otherSport: '',
    location: '', 
    description: '' ,
    eventDate: ''
  });
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "teams", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTeamData(docSnap.data());
        }
        setLoading(false);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

    const handleAnnounce = async (e) => {
  e.preventDefault();

  // 1. Basic Validation
  if (!announcement.title || !announcement.location) {
    return alert("Please fill Title and Location");
  }
  // Basic Validation: Sport select karna compulsory hai
  if (!announcement.category) {
    return alert("Please select a Sport Category 🏆");
  }

  // Agar 'Other' hai toh check karein ki naam likha hai ya nahi
  if (announcement.category === "Other" && !announcement.otherSport) {
    return alert("Please enter your Sport name");
  }

  setIsPosting(true);
  let finalImageUrl = ""; 

  try {
    // 2. CLOUDINARY UPLOAD LOGIC
    if (imageFile) {
      const data = new FormData();
const fileToUpload = imageFile[0] || imageFile; // FileList handle karne ke liye

data.append("file", fileToUpload);
data.append("upload_preset", "letsplay_uploads");

const res = await fetch("https://api.cloudinary.com/v1_1/djdzzp1wx/image/upload", {
  method: "POST",
  body: data,
});

if (!res.ok) {
  const errorJson = await res.json();
  console.log("Cloudinary Error:", errorJson);
  throw new Error("Upload failed: " + errorJson.error.message);
}

      const fileData = await res.json();
      finalImageUrl = fileData.secure_url; 
      console.log("Image Uploaded successfully! URL:", finalImageUrl);
    }

    // 3. FIREBASE SAVE SECTION
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
      
    // Final Category decide karna
    const finalCategory = announcement.category === "Other" ? announcement.otherSport : announcement.category;


     await addDoc(collection(db, "announcements"), {
      title: announcement.title,
      description: announcement.description || "",
      location: announcement.location,
      category: finalCategory, // Yahan ab user ka 'Other' wala naam jayega
       otherSportName: announcement.category === "Other" ? announcement.otherSport : "",
      eventDate: announcement.eventDate,
      teamName: teamData?.teamName || "Organizer",
      postImage: finalImageUrl, 
      userId: user.uid,
      createdAt: new Date()
    });

    alert("Announcement Published! 🚀");

    // 4. Form Reset
    setAnnouncement({ title: "", description: "", location: "", category: "", otherSport: "", teamName: "",eventDate: "" });
    setImageFile(null);
    if(document.getElementById('file-input')) document.getElementById('file-input').value = "";

  } catch (error) {
    console.error("Post Error Details:", error);
    alert("Error: " + error.message);
  } finally {
    setIsPosting(false);
  }
};



  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  if (loading) return <div className="text-white text-center mt-20 font-bold uppercase tracking-widest italic">Loading Team Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black text-yellow-400 italic uppercase tracking-tighter">Dashboard</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Manage your tournaments & team</p>
          </div>
          
          <div className="flex items-center gap-4">

          <button 
  onClick={() => navigate('/manage-announcements')}
  className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-400/10 flex items-center gap-2"
>
  ⚙️ Manage My Posts
</button>
            <button 
              onClick={() => navigate('/enrollments')}
              className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-400/10 flex items-center gap-2"
            >
              <span>👥</span> Enrollment Members
            </button>
           
           
          </div>
        </div>

        {teamData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
           {/* Team Info Sidebar */}
<div className="lg:col-span-1 space-y-6">
  <div onClick={() => navigate(`/profile/${auth.currentUser.uid}`)}
     className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group cursor-pointer hover:border-yellow-400/50 hover:shadow-yellow-400/5 transition-all duration-500 active:scale-[0.98]"
>
    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/5 blur-3xl rounded-full group-hover:bg-yellow-400/10 transition-all"></div>
    
    {/* --- Profile Photo Section Start --- */}
    <div className="relative w-20 h-20 mb-6 mx-auto lg:mx-0">
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700 group-hover:border-yellow-400 transition-colors">
        {teamData?.profilePic ? (
          <img 
            src={teamData.profilePic} 
            alt="Team Logo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl font-black">
            {teamData?.teamName?.charAt(0) || "T"}
          </div>
        )}
      </div>
      {/* Small badge/indicator */}
      <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-6 h-6 rounded-lg flex items-center justify-center shadow-lg">
         <span className="text-[10px]">⭐</span>
      </div>
    </div>
    {/* --- Profile Photo Section End --- */}

    <h2 className="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-4">Official Team Info</h2>
    <p className="text-3xl font-black italic text-white leading-tight mb-2 uppercase">{teamData?.teamName || "No Team"}</p>
    
    <div className="space-y-1">
       <p className="text-yellow-400 text-sm font-bold">Captain: {teamData?.captainName || "N/A"}</p>
       <p className="text-slate-500 text-xs font-medium">📍 {teamData?.location || "Unknown"}</p>
    </div>
  </div>

  <button 
    onClick={() => navigate('/update-profile')}
    className="w-full bg-slate-800 hover:bg-yellow-400 hover:text-black text-white py-3 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg hover:shadow-yellow-400/20"
  >
    Update Profile ✏️
  </button>


              
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 text-center">
                <p className="text-slate-500 text-xs font-bold uppercase">Need Help?</p>
                <p className="text-slate-400 text-[10px] mt-1 italic">Contact Support for tournament queries</p>
              </div>
      

            </div>

            {/* Announcement Form Section */}
            <div className="lg:col-span-2">
              <div className="p-8 md:p-10 bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                    <span className="text-3xl">📢</span> Create Announcement
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Post your match or tournament details here</p>
                </div>

                <form onSubmit={handleAnnounce} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                      <input 
                        placeholder="e.g. Sunday Mega Cup" 
                        className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold"
                        value={announcement.title} 
                        onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                      />
                    </div>
  
<div className="space-y-4"> 
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sport Category</label>
    <select 
      required
      className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold appearance-none cursor-pointer"
      value={announcement.category} 
      onChange={(e) => setAnnouncement({...announcement, category: e.target.value})}
    >
      <option value="" disabled>Select Sport 🏆</option>
      <option value="Cricket">Cricket 🏏</option>
      <option value="Football">Football ⚽</option>
      <option value="Volleyball">Volleyball 🏐</option>
      <option value="Kabaddi">Kabaddi 🤼</option>
      <option value="Free Fire">Free Fire 🔥</option>
       <option value="PUBG">PUBG 🔫</option>
      <option value="Other">Other (Type below) 🖊️</option>
    </select>
  </div>

  {/* Naya: Agar 'Other' select ho toh ye input box dikhega */}
  {announcement.category === "Other" && (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest ml-1">Enter Sport Name</label>
      <input 
        type="text"
        placeholder="Which sport? e.g. Badminton"
        className="w-full bg-slate-800/50 border border-yellow-400/30 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold"
        value={announcement.otherSport}
        onChange={(e) => setAnnouncement({...announcement, otherSport: e.target.value})}
      />
    </div>
  )}
</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Location</label>
                    <input 
                      placeholder="e.g. Gandhi Maidan, Ranchi" 
                      className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all"
                      value={announcement.location} 
                      onChange={(e) => setAnnouncement({...announcement, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
    📅 Event Date
  </label>
  <input 
    type="date"
    className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all font-bold text-white"
    value={announcement.eventDate} 
    onChange={(e) => setAnnouncement({...announcement, eventDate: e.target.value})}
  />
</div>


                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Description</label>
                    <textarea 
                      placeholder="Mention Entry Fee, Prize Money, Time, and Rules..." 
                      rows="4"
                      className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 transition-all"
                      value={announcement.description} 
                      onChange={(e) => setAnnouncement({...announcement, description: e.target.value})}
                    />
                  </div>
                  {/*image*/}
                   <div className="space-y-2"> 
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Tournament Poster / Photo
                     </label>
                 
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => setImageFile(e.target.files[0])} // [0] lagana ZAROORI hai
  className="..." 
/>


                    </div>
    

                  <button 
                    type="submit" 
                    disabled={isPosting} 
                    className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:bg-white active:scale-95 transition-all shadow-xl shadow-yellow-400/10 uppercase tracking-widest mt-4 disabled:opacity-50"
                  >
                    {isPosting ? "Posting Event..." : "Publish Announcement 🚀"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
