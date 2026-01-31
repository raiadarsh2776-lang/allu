
import React from 'react';
import { CONTACT_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-gray-900 dark:bg-black text-white pt-24 pb-12 px-6 md:px-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6">NEET Mastery</h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-8">
              Empowering students to crack NEET with focused biology preparation and comprehensive science practice.
            </p>
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-gray-800 dark:bg-slate-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition">📱</div>
               <div className="w-10 h-10 bg-gray-800 dark:bg-slate-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition">📺</div>
               <div className="w-10 h-10 bg-gray-800 dark:bg-slate-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition">✉</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Renewal Information</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Subscription is time-based</li>
              <li>Renew anytime after expiry</li>
              <li>Same competitive plans available for renewal</li>
              <li>Immediate access restoration</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>📞 {CONTACT_INFO.phone}</li>
              <li>✉ {CONTACT_INFO.email}</li>
              <li>📍 Uttar Pradesh, India</li>
              <li><a href="#" className="hover:text-emerald-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-800 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
          <div>© {new Date().getFullYear()} NEET Mastery. All rights reserved.</div>
          <div className="font-medium">Made for NEET Aspirants in India 🇮🇳</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">About</a>
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
