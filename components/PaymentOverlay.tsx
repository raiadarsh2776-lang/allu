
import React, { useState } from 'react';
import { Plan } from '../types';

interface PaymentOverlayProps {
  plan: Plan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentOverlay: React.FC<PaymentOverlayProps> = ({ plan, onClose, onSuccess }) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!plan) return null;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const paymentModes = [
    { id: 'upi', name: 'Instant UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', desc: 'Safe Bank Transfer' },
    { id: 'cards', name: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-emerald-950/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 transition-colors">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100">Checkout</h2>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Unlock Mastery Access</p>
            </div>
            <button onClick={onClose} className="bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-slate-600 hover:text-gray-900 dark:hover:text-slate-200 p-3 rounded-full transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-[2rem] p-6 mb-10 flex justify-between items-center transition-colors">
            <div>
              <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Plan Period</div>
              <div className="font-black text-gray-900 dark:text-slate-100 text-lg">{plan.duration}</div>
            </div>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{plan.price}</div>
          </div>

          <div className="space-y-3 mb-10">
            {paymentModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all text-left ${
                  selectedMode === mode.id 
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
                    : 'border-gray-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-100 dark:hover:border-emerald-800'
                }`}
              >
                <div className="text-2xl bg-white dark:bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                  {mode.icon}
                </div>
                <div>
                  <div className="font-black text-gray-900 dark:text-slate-100 text-sm uppercase tracking-wider">{mode.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 font-bold">{mode.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button 
            disabled={!selectedMode || processing}
            onClick={handlePay}
            className={`w-full py-5 rounded-[1.5rem] font-black text-xl transition shadow-2xl uppercase tracking-widest ${
              selectedMode && !processing
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/40' 
                : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            {processing ? 'Processing...' : 'Complete Payment'}
          </button>
          
          <p className="mt-6 text-center text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>
            SSL Secured Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverlay;
