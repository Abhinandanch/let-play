import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Sabhi zaroori imports check karein
import { updatePassword, updateEmail, sendEmailVerification } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const [formData, setFormData] = useState({
    teamName: '', 
    captainName: '', 
    phoneNumber: '', 
    location: '', // Yeh missing tha
    profilePic: '', 
    email: ''
  });
  
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "teams", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...docSnap.data(), email: user.email });
        }
        setLoading(false);
      } else { navigate('/login'); }
    };
    fetchUserData();
  }, [navigate]);

  // Cloudinary Upload Logic (Single File Handle)
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "letsplay_uploads");
    const res = await fetch("https://api.cloudinary.com/v1_1/djdzzp1wx/image/upload", { 
      method: "POST", 
      body: data 
    });
    const fileData = await res.json();
    return fileData.secure_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "teams", user.uid);
      const oldSnap = await getDoc(docRef);
      const oldData = oldSnap.data();

      // Image Logic
      let finalImageUrl = imageFile ? await uploadToCloudinary(imageFile) : oldData.profilePic;

      // Password Update
      if (newPassword.trim() !== "") {
        if (newPassword.length < 6) throw new Error("Password must be 6+ chars");
        await updatePassword(user, newPassword);
      }

      // Email Update
      if (newEmail.trim() !== "" && newEmail !== user.email) {
        try {
          await updateEmail(user, newEmail);
          await sendEmailVerification(user);
          alert("Verification link sent to new email! 📩");
        } catch (err) {
          if (err.code === 'auth/requires-recent-login') {
            alert("Please Relogin to change sensitive info like Email. 🔐");
            return;
          }
          throw err;
        }
      }

      // Firestore Update (Safe Merge)
      const updatedFirestoreData = {
        teamName: formData.teamName?.trim() || oldData.teamName || "",
        captainName: formData.captainName?.trim() || oldData.captainName || "",
        phoneNumber: formData.phoneNumber?.trim() || oldData.phoneNumber || "",
        location: formData.location?.trim() || oldData.location || "",
        profilePic: finalImageUrl || ""
      };

      await updateDoc(docRef, updatedFirestoreData);
      alert("Profile Updated! 🚀");
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally { setIsUpdating(false); }
  };

  if (loading) return <div className="text-white p-20 text-center font-black animate-pulse uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex justify-center items-center">
      <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-800 w-full max-w-xl shadow-2xl relative overflow-hidden">
        <h2 className="text-3xl font-black italic text-yellow-400 uppercase mb-8 border-b border-slate-800 pb-4 tracking-tighter">Edit Profile</h2>
        
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col items-center bg-slate-800/40 p-6 rounded-3xl border border-dashed border-slate-700">
            <div className="w-24 h-24 rounded-2xl bg-slate-700 overflow-hidden mb-4 border-2 border-yellow-400">
              <img 
                src={imageFile ? URL.createObjectURL(imageFile) : (formData.profilePic || `https://ui-avatars.com{formData.teamName || 'T'}&background=fbbf24&color=000&bold=true`)} 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>
            <label className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-white transition-all">
              Change Photo
              <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Team Name</label>
            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={formData.teamName || ""} onChange={(e) => setFormData({...formData, teamName: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Captain Name</label>
            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={formData.captainName || ""} onChange={(e) => setFormData({...formData, captainName: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Location</label>
            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={formData.location || ""} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Mobile</label>
            <input className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={formData.phoneNumber || ""} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-yellow-500 uppercase ml-2">New Email</label>
            <input type="email" placeholder={formData.email} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-yellow-500 uppercase ml-2">New Password</label>
            <input type="password" placeholder="Min 6 chars" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-yellow-400 font-bold" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div className="md:col-span-2 flex gap-4 pt-6">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-slate-800 py-4 rounded-2xl font-black uppercase text-[10px]">Back</button>
            <button type="submit" disabled={isUpdating} className="flex-1 bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl">
              {isUpdating ? "Syncing..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
