'use client';

import { Plus, Star, RefreshCw, Trash2, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import type { AdminReview } from '../../types';

interface ReviewsTabProps {
  reviews: AdminReview[];
  isLoading: boolean;
  onRefreshReviews: () => Promise<void>;
  onAddReview: (reviewData: {
    name: string;
    rating: number;
    comment: string;
    designation?: string;
    avatarText?: string;
    isApproved?: boolean;
  }) => Promise<boolean>;
  onToggleApproval: (id: string, currentStatus: boolean) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
}

export default function ReviewsTab({
  reviews,
  isLoading,
  onRefreshReviews,
  onAddReview,
  onToggleApproval,
  onDeleteReview,
}: ReviewsTabProps) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Verified Patient');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const success = await onAddReview({
      name: name.trim(),
      designation: designation.trim() || 'Verified Buyer',
      rating,
      comment: comment.trim(),
      avatarText: name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      isApproved,
    });
    setIsSubmitting(false);

    if (success) {
      setName('');
      setComment('');
      setRating(5);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] font-extrabold text-wellness-charcoal/40 uppercase tracking-widest block mb-1">
            Total Reviews
          </span>
          <div className="text-3xl font-heading font-black text-wellness-navy">
            {reviews.length}
          </div>
        </div>

        <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] font-extrabold text-wellness-charcoal/40 uppercase tracking-widest block mb-1">
            Average Rating
          </span>
          <div className="text-3xl font-heading font-black text-wellness-navy flex items-center gap-2">
            <span>{avgRating}</span>
            <div className="flex items-center text-amber-400">
              <Star size={20} className="fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] font-extrabold text-wellness-charcoal/40 uppercase tracking-widest block mb-1">
            Live on Home Page
          </span>
          <div className="text-3xl font-heading font-black text-emerald-600">{approvedCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Add Review Form */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h4 className="text-sm font-extrabold text-wellness-navy uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus size={16} className="text-wellness-green" />
              Add Customer Review
            </h4>

            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-wellness-navy mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="e.g. Dr. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 bg-wellness-white border border-wellness-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-wellness-green transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-wellness-navy mb-1.5">
                  Designation / Badge
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                  }}
                  placeholder="e.g. Verified Patient, Chronic Care"
                  className="w-full px-3.5 py-2.5 bg-wellness-white border border-wellness-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-wellness-green transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-wellness-navy mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => {
                        setRating(starVal);
                      }}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={
                          starVal <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-wellness-gray-200'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-wellness-navy ml-2">{rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-wellness-navy mb-1.5">
                  Review Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder="Share the customer's experience, feedback on medicine quality, packaging, delivery..."
                  className="w-full px-3.5 py-2.5 bg-wellness-white border border-wellness-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-wellness-green transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-wellness-navy">Publish immediately</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsApproved(!isApproved);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isApproved ? 'bg-wellness-green' : 'bg-wellness-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      isApproved ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !comment.trim()}
                className="w-full mt-2 bg-wellness-green hover:bg-wellness-navy text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Review...</span>
                ) : (
                  <>
                    <Plus size={15} />
                    <span>Save Review</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Reviews Table */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-heading font-extrabold text-wellness-navy">
                  Published Reviews &amp; Testimonials
                </h4>
                <p className="text-xs text-wellness-charcoal/50 mt-0.5">
                  Reviews displayed in the &ldquo;What Our Customers Say&rdquo; section on the home
                  page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void onRefreshReviews();
                }}
                disabled={isLoading}
                className="p-2 text-wellness-charcoal/40 hover:text-wellness-navy hover:bg-wellness-gray-100 rounded-xl transition-all cursor-pointer"
                title="Refresh reviews"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-16 text-wellness-charcoal/40 space-y-3">
                <MessageSquare size={36} className="mx-auto opacity-30" />
                <p className="text-xs font-bold uppercase tracking-wider">No reviews found</p>
                <p className="text-xs">Add customer reviews using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 border border-wellness-gray-200 rounded-2xl hover:border-wellness-green/30 transition-all flex flex-col sm:flex-row gap-4 sm:items-start justify-between bg-wellness-white/50"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar Circle */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {r.avatarText || r.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-heading font-bold text-sm text-wellness-navy">
                            {r.name}
                          </h5>
                          {r.designation && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {r.designation}
                            </span>
                          )}
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].slice(0, r.rating).map((starIdx) => (
                            <Star
                              key={starIdx}
                              size={13}
                              className="fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-wellness-charcoal/80 leading-relaxed font-normal pt-1 italic">
                          &ldquo;{r.comment}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-wellness-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          void onToggleApproval(r.id, r.isApproved);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                          r.isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle live status"
                      >
                        {r.isApproved ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete review from ${r.name}?`)) {
                            void onDeleteReview(r.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
