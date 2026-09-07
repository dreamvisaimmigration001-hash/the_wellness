'use client';

import { Sparkles, ArrowLeft, AlertCircle, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface AdminAuthRequiredProps {
  sessionUser?: {
    name?: string;
    email?: string;
  } | null;
  isLoggingIn: boolean;
  loginError: string;
  onLogin: () => void;
  onSignOut?: () => void;
}

export default function AdminAuthRequired({
  sessionUser,
  isLoggingIn,
  loginError,
  onLogin,
  onSignOut,
}: AdminAuthRequiredProps) {
  const isUnauthorizedUser = Boolean(sessionUser);

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="glow-orb bg-wellness-green/10 absolute -top-40 -left-40 w-96 h-96"></div>
      <div className="glow-orb bg-wellness-navy/10 absolute -bottom-40 -right-40 w-96 h-96"></div>

      <div className="max-w-md w-full bg-white/90 border border-wellness-gray-200 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden glass-premium text-left z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-wellness-navy text-wellness-green border border-wellness-green/30 flex items-center justify-center font-black shadow-lg shadow-wellness-navy/20 shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="text-xl font-heading font-black text-wellness-navy tracking-tight block">
              The Wellness<span className="text-wellness-green font-medium">.</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-wellness-green bg-wellness-green/10 px-2 py-0.5 rounded border border-wellness-green/20">
              Clinical Control Portal
            </span>
          </div>
        </div>

        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-heading font-bold text-wellness-navy">
            {isUnauthorizedUser
              ? 'Insufficient Privileges'
              : 'Administrator Authorization Required'}
          </h1>
          <p className="text-xs text-wellness-charcoal/60 leading-relaxed font-semibold">
            {isUnauthorizedUser
              ? 'Your authenticated account is not authorized as a clinical administrator. Please switch to an authorized administrative account.'
              : 'Please sign in with verified clinical administrator credentials to access inventory controls, orders, and diagnostic analytics.'}
          </p>
        </div>

        {sessionUser && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-wellness-navy truncate">
                {sessionUser.name || 'User'}
              </p>
              <p className="text-[10px] text-wellness-charcoal/60 truncate font-mono">
                {sessionUser.email || ''}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isUnauthorizedUser ? (
            <button
              onClick={onSignOut}
              className="w-full bg-wellness-navy hover:bg-wellness-green text-white font-extrabold text-xs py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <LogOut size={16} />
              Sign Out & Switch Account
            </button>
          ) : (
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="w-full bg-wellness-navy hover:bg-wellness-green text-white font-extrabold text-xs py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              {isLoggingIn ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In with Admin Account
                </>
              )}
            </button>
          )}

          <Link
            href="/"
            className="w-full bg-white hover:bg-wellness-gray-100/80 border border-wellness-gray-200 text-wellness-navy font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Return to Public Storefront
          </Link>
        </div>

        {loginError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex gap-2 items-center">
            <AlertCircle size={16} />
            <span>{loginError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
