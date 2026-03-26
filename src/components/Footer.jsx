import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-black text-yellow-400 italic tracking-tighter mb-4 block">
              LET'S PLAY
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              India's growing platform for local sports tournaments. Connect, Compete, and Conquer. 🏆
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Quick Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/signup" className="hover:text-yellow-400 transition-colors">Register Team</Link></li>
              <li><Link to="/dashboard" className="hover:text-yellow-400 transition-colors">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Support & Help</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><Link to="#" className="hover:text-yellow-400 transition-colors">How to Enroll?</Link></li>
              <li><Link to="#" className="hover:text-yellow-400 transition-colors">Rules & Regulations</Link></li>
              <li><Link to="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Contact Us</h4>
            <div className="space-y-4">
              <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                <span className="text-yellow-400">📧</span> support@letsplay.com
              </p>
              <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                <span className="text-yellow-400">📍</span> Dhanbad, Jharkhand, India
              </p>
              <div className="flex gap-4 pt-2">
                <span className="cursor-pointer hover:text-yellow-400 transition-colors">📱 IG</span>
                <span className="cursor-pointer hover:text-yellow-400 transition-colors">🐦 TW</span>
                <span className="cursor-pointer hover:text-yellow-400 transition-colors">📺 YT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © {currentYear} LET'S PLAY INC. ALL RIGHTS RESERVED.
          </p>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            MADE WITH ❤️ FOR ATHLETES
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
