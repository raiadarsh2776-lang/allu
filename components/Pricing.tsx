
import React from 'react';
import { PLANS } from '../constants';
import { Plan } from '../types';

interface PricingProps {
  onSubscribe: (plan: Plan) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSubscribe }) => {
  return (
    <section id="plans" className="py-32 px-4 md:px-12 bg-gray-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-4">Simple & Affordable Plans</h2>
          <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">Focus on your studies, not the cost. Choose a plan that fits your preparation timeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`bg-white dark:bg-slate-900 border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col ${plan.price === 399 ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-gray-100 dark:border-slate-800'}`}>
              {plan.price === 399 && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Best Value
                </div>
              )}
              <div className="text-gray-500 dark:text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{plan.duration}</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-gray-900 dark:text-slate-50">₹{plan.price}</span>
              </div>
              
              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "Full access to all subjects",
                  "Chapter-wise practice",
                  "NEET Standard tests",
                  "Biology focused prep"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onSubscribe(plan)}
                className={`w-full py-4 rounded-xl font-bold transition shadow-md ${plan.price === 399 ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 shadow-gray-100 dark:shadow-none'}`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-colors">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Already a member?</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm">You can upgrade or renew your current plan at any time.</p>
          </div>
          <button 
            onClick={() => onSubscribe(PLANS[1])}
            className="px-10 py-4 bg-white dark:bg-slate-800 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
          >
            Renew / Upgrade Plan
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
