import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterTeam from './pages/RegisterTeam';
import Dashboard from './pages/Dashboard'; 
import Login from './pages/Login';
import Navbar from './components/Navbar'; 
import Enrollments from './pages/Enrollments'; // 1. Import check karein
import Footer from './components/Footer'; 
import ManageAnnouncements from './pages/ManageAnnouncements';
import EditPost from './pages/EditPost';
import AdminDashboard from './pages/AdminDashboard';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import FinishRegistration from './components/FinishRegistration';
import AdminProfileView from './pages/AdminProfileView';
import HowToEnroll from './pages/HowToEnroll';
import Rules from './pages/Rules'; 
import Privacy from './pages/Privacy';
import Vision from './pages/Vision';
import Feedback from './pages/Feedback';


function App() {
  return (
    <Router>
      <Navbar /> 
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegisterTeam />} />
        <Route path="/register" element={<RegisterTeam />} />
        <Route path="/register/:gameId" element={<RegisterTeam />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/enrollments" element={<Enrollments />} />
         <Route path="/manage-announcements" element={<ManageAnnouncements />} />
        <Route path="/edit-post/:postId" element={<EditPost />} /> 
        <Route path="/admin-control-panel" element={<AdminDashboard />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path='/finish-registration' element={<FinishRegistration />} />
    <Route path="/admin/team-profile/:uid" element={<AdminProfileView />} />
    <Route path="/how-to-enroll" element={<HowToEnroll />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/vision" element={<Vision />} />
    <Route path="/feedback" element={<Feedback />} />
      </Routes>
       <Footer />
    </Router>
  );
}

export default App;
