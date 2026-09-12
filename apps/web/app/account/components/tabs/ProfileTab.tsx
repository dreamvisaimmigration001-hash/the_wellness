'use client';

import { LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
  };
  onSignOut: () => Promise<void>;
}

export default function ProfileTab({ user, onSignOut }: ProfileTabProps) {
  return (
    <motion.div
      key="profile-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 border border-wellness-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg glass-premium"
    >
      <div className="border-b border-wellness-gray-200 pb-4">
        <h3 className="text-lg font-heading font-extrabold text-wellness-navy">Profile Details</h3>
        <p className="text-xs text-wellness-charcoal/50 mt-0.5">
          Your personal healthcare settings and dashboard configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-wellness-charcoal/80">
        <div>
          <p className="text-wellness-charcoal/40 font-bold uppercase tracking-wider text-[9px]">
            Account Name
          </p>
          <p className="text-sm font-bold text-wellness-navy mt-1">{user.name}</p>
        </div>
        <div>
          <p className="text-wellness-charcoal/40 font-bold uppercase tracking-wider text-[9px]">
            Primary Email
          </p>
          <p className="text-sm font-medium text-wellness-navy mt-1">{user.email}</p>
        </div>
      </div>

      <div className="border-t border-wellness-gray-200 pt-6 flex justify-end items-center text-xs font-semibold text-wellness-charcoal/50">
        <button
          onClick={() => {
            void onSignOut();
          }}
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={10} />
          <span>Sign Out from Device</span>
        </button>
      </div>
    </motion.div>
  );
}
