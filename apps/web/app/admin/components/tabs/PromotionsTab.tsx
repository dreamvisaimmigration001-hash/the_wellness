'use client';

import {
  Percent,
  Plus,
  Eye,
  Megaphone,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';

import { PromotionItem } from '../../types';

import { API_BASE_URL } from '@/lib/config';

interface PromotionsTabProps {
  promotionsList: PromotionItem[];
  loadPromotions: () => Promise<void>;
  showNotice: (message: string, type?: 'error' | 'warning' | 'success') => void;
  uploadToCloudinary: (file: File, folder?: string) => Promise<string>;
  confirmAction?: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => Promise<void> | void;
  }) => void;
}

type PromoSubTab = 'banners' | 'announcement' | 'deals';

function toLocalDatetimeInput(isoString?: string | null): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${String(d.getFullYear())}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PromotionsTab({
  promotionsList,
  loadPromotions,
  showNotice,
  uploadToCloudinary,
  confirmAction,
}: PromotionsTabProps) {
  const [subTab, setSubTab] = useState<PromoSubTab>('banners');

  // Promotional Banner State
  const [activePromoId, setActivePromoId] = useState<string | null>(null);
  const [promoTitle, setPromoTitle] = useState('New Homepage Banner');
  const [promoImage, setPromoImage] = useState('/images/clinical_ad_banner.jpg');
  const [promoLink, setPromoLink] = useState('/products');
  const [promoDiscountText, setPromoDiscountText] = useState('');
  const [promoDescription, setPromoDescription] = useState('');
  const [promoIsActive, setPromoIsActive] = useState(true);
  const [savingPromotion, setSavingPromotion] = useState(false);

  // Announcement Bar State
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [announcementBadge, setAnnouncementBadge] = useState('Limited Offer');
  const [announcementText, setAnnouncementText] = useState(
    'Save 20% on your first order with code',
  );
  const [announcementCode, setAnnouncementCode] = useState('WELLNESS20');
  const [announcementCta, setAnnouncementCta] = useState('Shop Now');
  const [announcementLink, setAnnouncementLink] = useState('/products');
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  // Daily Deals State
  const [dealsEnabled, setDealsEnabled] = useState(true);
  const [dealsDiscountPercentage, setDealsDiscountPercentage] = useState<number>(25);
  const [dealsDiscountText, setDealsDiscountText] = useState('Save 25% Today');
  const [dealsTitle, setDealsTitle] = useState('Daily Clinical Deals');
  const [dealsDescription, setDealsDescription] = useState(
    'Exclusive daily discounts on essential medications and healthcare formulations.',
  );
  const [dealsEndTime, setDealsEndTime] = useState<string>('');
  const [savingDeals, setSavingDeals] = useState(false);

  // Fetch site settings on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        if (res.ok) {
          const json = (await res.json()) as {
            success?: boolean;
            data?: {
              announcement?: {
                enabled: boolean;
                badge: string;
                text: string;
                code?: string | null;
                cta?: string | null;
                link?: string | null;
              };
              deals?: {
                enabled: boolean;
                discountPercentage?: number | null;
                discountText?: string | null;
                title?: string | null;
                description?: string | null;
                endTime?: string | null;
              };
            };
          };

          if (json.success && json.data && isMounted) {
            if (json.data.announcement) {
              const ann = json.data.announcement;
              setAnnouncementEnabled(ann.enabled);
              if (ann.badge) setAnnouncementBadge(ann.badge);
              if (ann.text) setAnnouncementText(ann.text);
              if (ann.code !== undefined) setAnnouncementCode(ann.code || '');
              if (ann.cta !== undefined) setAnnouncementCta(ann.cta || '');
              if (ann.link !== undefined) setAnnouncementLink(ann.link || '');
            }

            if (json.data.deals) {
              const d = json.data.deals;
              setDealsEnabled(d.enabled);
              if (d.discountPercentage !== undefined && d.discountPercentage !== null) {
                setDealsDiscountPercentage(d.discountPercentage);
              }
              if (d.discountText) setDealsDiscountText(d.discountText);
              if (d.title) setDealsTitle(d.title);
              if (d.description) setDealsDescription(d.description);
              if (d.endTime) {
                setDealsEndTime(toLocalDatetimeInput(d.endTime));
              } else {
                // Default to 24h from now if not set
                const defaultEnd = new Date(Date.now() + 24 * 60 * 60 * 1000);
                setDealsEndTime(toLocalDatetimeInput(defaultEnd.toISOString()));
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load settings in PromotionsTab:', err);
      }
    }
    void loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setActivePromoId(null);
    setPromoTitle('New Homepage Banner');
    setPromoImage('/images/clinical_ad_banner.jpg');
    setPromoLink('/products');
    setPromoDiscountText('');
    setPromoDescription('');
    setPromoIsActive(true);
  };

  const handleToggleStatus = async (promo: PromotionItem) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/promotions/${promo.id}/status`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) await loadPromotions();
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  const handleDeletePromotion = (promo: PromotionItem) => {
    const doDelete = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/promotions/${promo.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          if (activePromoId === promo.id) {
            resetForm();
          }
          await loadPromotions();
          showNotice('Banner deleted successfully.', 'success');
        } else {
          showNotice('Failed to delete banner.', 'error');
        }
      } catch (e) {
        console.error('Failed to delete promotion:', e);
        showNotice('Failed to delete promotion.', 'error');
      }
    };

    if (confirmAction) {
      confirmAction({
        title: 'Delete Banner',
        message: `Are you sure you want to permanently delete promotional banner "${promo.title}"?`,
        confirmText: 'Yes, Delete Banner',
        cancelText: 'Cancel',
        variant: 'danger',
        onConfirm: doDelete,
      });
    } else {
      void doDelete();
    }
  };

  const handleSavePromotion = async () => {
    if (!promoImage) {
      showNotice('Please choose or provide an image URL for the banner.', 'warning');
      return;
    }
    try {
      setSavingPromotion(true);
      const payload = {
        title: promoTitle || 'Homepage Banner',
        imageUrl: promoImage,
        targetUrl: promoLink || '/products',
        discountText: promoDiscountText || null,
        description: promoDescription || null,
        isActive: promoIsActive,
      };

      let res: Response;
      if (activePromoId) {
        res = await fetch(`${API_BASE_URL}/api/promotions/${activePromoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/promotions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showNotice('Promotional banner saved to database successfully!', 'success');
        await loadPromotions();
      } else {
        const err = (await res.json()) as { message?: string };
        showNotice(`Failed to save banner: ${err.message || 'Error occurred'}`);
      }
    } catch (e) {
      console.error('Save promotion error:', e);
      showNotice('Error saving promotional banner.');
    } finally {
      setSavingPromotion(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    try {
      setSavingAnnouncement(true);
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          announcement: {
            enabled: announcementEnabled,
            badge: announcementBadge,
            text: announcementText,
            code: announcementCode || null,
            cta: announcementCta || null,
            link: announcementLink || '/products',
          },
        }),
      });

      if (res.ok) {
        showNotice('Announcement bar configuration saved successfully!', 'success');
      } else {
        const err = (await res.json()) as { message?: string };
        showNotice(`Failed to save announcement bar: ${err.message || 'Error occurred'}`);
      }
    } catch (e) {
      console.error('Save announcement error:', e);
      showNotice('Error saving announcement bar settings.');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleSaveDeals = async () => {
    try {
      setSavingDeals(true);
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          deals: {
            enabled: dealsEnabled,
            discountPercentage: dealsDiscountPercentage || 0,
            discountText: dealsDiscountText || null,
            title: dealsTitle || 'Daily Clinical Deals',
            description: dealsDescription || null,
            endTime: dealsEndTime ? new Date(dealsEndTime).toISOString() : null,
          },
        }),
      });

      if (res.ok) {
        showNotice('Daily deals and timer settings saved successfully!', 'success');
      } else {
        const err = (await res.json()) as { message?: string };
        showNotice(`Failed to save daily deals: ${err.message || 'Error occurred'}`);
      }
    } catch (e) {
      console.error('Save deals error:', e);
      showNotice('Error saving daily deals settings.');
    } finally {
      setSavingDeals(false);
    }
  };

  const setDealsHoursFromNow = (hours: number) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    setDealsEndTime(toLocalDatetimeInput(d.toISOString()));
  };

  // Check deals status for live feedback
  const dealsEndMs = dealsEndTime ? new Date(dealsEndTime).getTime() : 0;
  const isDealsExpired = dealsEndMs > 0 && dealsEndMs <= Date.now();
  const dealsHoursLeft =
    dealsEndMs > Date.now() ? Math.floor((dealsEndMs - Date.now()) / (1000 * 60 * 60)) : 0;
  const dealsMinutesLeft =
    dealsEndMs > Date.now() ? Math.floor(((dealsEndMs - Date.now()) / (1000 * 60)) % 60) : 0;

  return (
    <motion.div
      key="promotions"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header & Sub-Navigation */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-wellness-navy flex items-center gap-2">
            <Percent size={18} className="text-wellness-green" />
            Marketing & Storefront Promotions
          </h3>
          <p className="text-xs text-wellness-charcoal/60 mt-0.5 font-medium">
            Control promotional banners, the announcement bar, and homepage daily deals countdown
            timer.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap bg-wellness-gray-100 p-1.5 rounded-2xl border border-wellness-gray-200/80 gap-1 self-start">
          <button
            type="button"
            onClick={() => {
              setSubTab('banners');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'banners'
                ? 'bg-wellness-navy text-white shadow-sm'
                : 'text-wellness-charcoal/70 hover:text-wellness-navy hover:bg-white/60'
            }`}
          >
            <Percent size={14} />
            <span>Graphic Banners</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('announcement');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'announcement'
                ? 'bg-wellness-navy text-white shadow-sm'
                : 'text-wellness-charcoal/70 hover:text-wellness-navy hover:bg-white/60'
            }`}
          >
            <Megaphone size={14} />
            <span>Announcement Bar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('deals');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'deals'
                ? 'bg-wellness-navy text-white shadow-sm'
                : 'text-wellness-charcoal/70 hover:text-wellness-navy hover:bg-white/60'
            }`}
          >
            <Clock size={14} />
            <span>Daily Deals & Timer</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. GRAPHIC BANNERS SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="bg-wellness-green hover:bg-wellness-navy text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              Add New Banner
            </button>
          </div>

          {/* Existing Banners List from DB */}
          {promotionsList.length > 0 && (
            <div className="bg-white border border-wellness-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-wellness-navy uppercase tracking-wider flex items-center gap-2">
                <Eye size={14} className="text-wellness-green" />
                Database Banners & Promotions ({promotionsList.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotionsList.map((promo) => {
                  const isCurrentSelected = activePromoId === promo.id;
                  return (
                    <div
                      key={promo.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrentSelected
                          ? 'border-wellness-green bg-wellness-green/5 shadow-md'
                          : 'border-wellness-gray-200 bg-wellness-gray-50/50 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-wellness-gray-200">
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="object-cover w-full h-full"
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              promo.isActive
                                ? 'bg-wellness-green text-white'
                                : 'bg-wellness-charcoal/20 text-wellness-navy'
                            }`}
                          >
                            {promo.isActive ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-wellness-navy line-clamp-1">
                            {promo.title}
                          </p>
                          <p className="text-[10px] text-wellness-charcoal/60 line-clamp-1 mt-0.5">
                            Target: {promo.targetUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-wellness-gray-200/60 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePromoId(promo.id);
                            setPromoTitle(promo.title);
                            setPromoImage(promo.imageUrl);
                            setPromoLink(promo.targetUrl);
                            setPromoDiscountText(promo.discountText || '');
                            setPromoDescription(promo.description || '');
                            setPromoIsActive(promo.isActive);
                          }}
                          className="text-wellness-navy hover:text-wellness-green font-bold text-[11px] cursor-pointer"
                        >
                          {isCurrentSelected ? 'Editing' : 'Edit Banner'}
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              void handleToggleStatus(promo);
                            }}
                            className="text-[10px] font-bold text-wellness-charcoal/60 hover:text-wellness-navy cursor-pointer"
                          >
                            {promo.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleDeletePromotion(promo);
                            }}
                            className="text-[10px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Banner Edit Form */}
          <div className="bg-white border border-wellness-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-wellness-navy uppercase tracking-wider flex items-center gap-2">
                {activePromoId
                  ? `Editing Banner: ${promoTitle}`
                  : 'New Banner Configuration & Live Preview'}
              </h4>
              <p className="text-[10px] text-wellness-charcoal/50">
                Preview how this promotional banner graphic renders on the homepage storefront.
              </p>
              <div className="relative w-full max-w-[800px] aspect-[21/9] rounded-[24px] overflow-hidden border border-wellness-gray-200 shadow-xl bg-gradient-to-r from-wellness-navy via-[#1E5C5A] to-wellness-green text-white mt-2 p-6 sm:p-8 flex flex-col justify-between animate-gradient-shift">
                <div className="flex items-center justify-between">
                  <span className="bg-wellness-light-green/20 text-wellness-light-green text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-wellness-light-green/20">
                    {promoDiscountText || 'Clinical Special'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-white/70 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
                    {promoIsActive ? '● Live Storefront' : '○ Inactive Draft'}
                  </span>
                </div>
                <div className="space-y-1.5 z-10">
                  <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
                    {promoTitle || 'Homepage Promotional Banner'}
                  </h3>
                  {promoDescription && (
                    <p className="text-xs text-wellness-light-green/90 font-medium line-clamp-2 max-w-lg">
                      {promoDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-white text-wellness-navy font-extrabold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer hover:bg-wellness-light-green transition-colors">
                    Claim Offer →
                  </span>
                  <span className="text-[10px] font-mono text-white/50">Target: {promoLink}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-wellness-gray-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Special Clinical Wellness Offer"
                    value={promoTitle}
                    onChange={(e) => {
                      setPromoTitle(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                    Upload Graphic Banner Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer border border-dashed border-wellness-gray-200 hover:border-wellness-green transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-1 bg-wellness-gray-50 text-center w-32 h-24 shrink-0">
                      <Plus size={20} className="text-wellness-navy/60" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-wellness-charcoal/60">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            void uploadToCloudinary(file, 'wellness_promotions').then(
                              (cloudUrl) => {
                                if (cloudUrl) {
                                  setPromoImage(cloudUrl);
                                }
                              },
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="text-[11px] text-wellness-charcoal/60 leading-relaxed">
                      <p className="font-extrabold text-wellness-navy">
                        Recommended size: 1200 x 500 px (21:9 Aspect Ratio)
                      </p>
                      <p className="mt-1">Supported formats: JPG, PNG, WEBP.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                    Or Paste Banner Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/banner.png"
                    value={promoImage.startsWith('data:') ? '' : promoImage}
                    onChange={(e) => {
                      if (e.target.value) {
                        setPromoImage(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                    Click Destination Path
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /products, /products?category=Pediatrics"
                    value={promoLink}
                    onChange={(e) => {
                      setPromoLink(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
                  />
                  <p className="text-[10px] text-wellness-charcoal/50 mt-1">
                    Where customers will be redirected when clicking the advertisement graphic.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                    Discount / Promotional Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FLAT 20% OFF or CLINICAL EXCLUSIVE"
                    value={promoDiscountText}
                    onChange={(e) => {
                      setPromoDiscountText(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="promoIsActive"
                    checked={promoIsActive}
                    onChange={(e) => {
                      setPromoIsActive(e.target.checked);
                    }}
                    className="w-4 h-4 text-wellness-green border-wellness-gray-300 rounded focus:ring-wellness-green cursor-pointer"
                  />
                  <label
                    htmlFor="promoIsActive"
                    className="text-xs font-bold text-wellness-navy cursor-pointer"
                  >
                    Active & Visible on Store Homepage
                  </label>
                </div>

                <div className="pt-4 flex gap-3 flex-wrap">
                  <button
                    type="button"
                    disabled={savingPromotion}
                    onClick={() => {
                      void handleSavePromotion();
                    }}
                    className="bg-wellness-green hover:bg-wellness-navy text-white text-xs font-black uppercase tracking-wider px-6 py-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingPromotion
                      ? 'Saving to Database...'
                      : activePromoId
                        ? 'Update Banner in Database'
                        : 'Save New Banner to Database'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-wellness-gray-200 hover:bg-wellness-gray-50 text-wellness-navy text-xs font-black uppercase tracking-wider px-5 py-4 rounded-xl transition-all cursor-pointer"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ANNOUNCEMENT BAR SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'announcement' && (
        <div className="bg-white border border-wellness-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-wellness-gray-100 pb-6">
            <div>
              <h4 className="text-sm font-heading font-black text-wellness-navy uppercase tracking-wider flex items-center gap-2">
                <Megaphone size={16} className="text-wellness-green" />
                Storefront Top Announcement Bar
              </h4>
              <p className="text-xs text-wellness-charcoal/60 mt-1">
                Customize the high-priority announcement strip displayed across the top of every
                page.
              </p>
            </div>

            {/* Visibility Switch */}
            <div className="flex items-center gap-3 bg-wellness-gray-50 px-4 py-2 rounded-2xl border border-wellness-gray-200">
              <span className="text-xs font-bold text-wellness-navy">Banner Status:</span>
              <button
                type="button"
                onClick={() => {
                  setAnnouncementEnabled(!announcementEnabled);
                }}
                className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  announcementEnabled
                    ? 'bg-wellness-green text-white shadow-sm'
                    : 'bg-wellness-charcoal/20 text-wellness-charcoal/70'
                }`}
              >
                {announcementEnabled ? 'Active (Visible)' : 'Disabled (Hidden)'}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-wellness-navy uppercase tracking-wider">
              Live Preview
            </span>
            <div className="bg-gradient-to-r from-wellness-navy via-[#1E5C5A] to-wellness-green text-white p-3 rounded-2xl flex items-center justify-between text-xs px-6 shadow-sm border border-white/10">
              <div className="flex items-center gap-2.5 mx-auto">
                {announcementBadge && (
                  <span className="bg-wellness-light-green/20 text-wellness-light-green text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border border-wellness-light-green/20">
                    {announcementBadge}
                  </span>
                )}
                <span className="font-semibold text-wellness-light-green/95">
                  {announcementText || 'Your announcement message goes here...'}
                </span>
                {announcementCode && (
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono text-[10px] border border-white/10 font-bold">
                    {announcementCode}
                  </span>
                )}
                {announcementCta && (
                  <span className="text-white underline underline-offset-4 font-extrabold hover:text-wellness-light-green cursor-pointer ml-1">
                    {announcementCta} →
                  </span>
                )}
              </div>
            </div>
            {!announcementEnabled && (
              <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                <AlertCircle size={13} />
                The announcement bar is currently toggled OFF and will not be displayed on the
                storefront.
              </p>
            )}
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-wellness-gray-100">
            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Badge Label
              </label>
              <input
                type="text"
                placeholder="e.g. Limited Offer, Flash Sale, Free Shipping"
                value={announcementBadge}
                onChange={(e) => {
                  setAnnouncementBadge(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Promo / Coupon Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. WELLNESS20, FREESHIP"
                value={announcementCode}
                onChange={(e) => {
                  setAnnouncementCode(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Announcement Message Text
              </label>
              <input
                type="text"
                placeholder="e.g. Save 20% on your first pharmaceutical formulation order"
                value={announcementText}
                onChange={(e) => {
                  setAnnouncementText(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                CTA Action Label
              </label>
              <input
                type="text"
                placeholder="e.g. Shop Now, Claim Offer"
                value={announcementCta}
                onChange={(e) => {
                  setAnnouncementCta(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Destination Target Link
              </label>
              <input
                type="text"
                placeholder="e.g. /products, /products?category=OTC"
                value={announcementLink}
                onChange={(e) => {
                  setAnnouncementLink(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-wellness-gray-100 flex justify-end">
            <button
              type="button"
              disabled={savingAnnouncement}
              onClick={() => {
                void handleSaveAnnouncement();
              }}
              className="bg-wellness-green hover:bg-wellness-navy text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={15} />
              {savingAnnouncement ? 'Saving Changes...' : 'Save Announcement Bar'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DAILY DEALS & COUNTDOWN TIMER SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'deals' && (
        <div className="bg-white border border-wellness-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-wellness-gray-100 pb-6">
            <div>
              <h4 className="text-sm font-heading font-black text-wellness-navy uppercase tracking-wider flex items-center gap-2">
                <Flame size={16} className="text-wellness-green fill-wellness-green" />
                Homepage Daily Deals & Countdown Timer
              </h4>
              <p className="text-xs text-wellness-charcoal/60 mt-1">
                Configure discount rates, promotional copy, and the active countdown timer for the
                daily deals section.
              </p>
            </div>

            {/* Visibility Switch */}
            <div className="flex items-center gap-3 bg-wellness-gray-50 px-4 py-2 rounded-2xl border border-wellness-gray-200">
              <span className="text-xs font-bold text-wellness-navy">Deals Section Status:</span>
              <button
                type="button"
                onClick={() => {
                  setDealsEnabled(!dealsEnabled);
                }}
                className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  dealsEnabled
                    ? 'bg-wellness-green text-white shadow-sm'
                    : 'bg-wellness-charcoal/20 text-wellness-charcoal/70'
                }`}
              >
                {dealsEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Live Status Card */}
          <div
            className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
              !dealsEnabled
                ? 'bg-wellness-gray-50 border-wellness-gray-200 text-wellness-charcoal/70'
                : isDealsExpired
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {!dealsEnabled ? (
                <AlertCircle size={20} className="text-wellness-charcoal/40" />
              ) : isDealsExpired ? (
                <Clock size={20} className="text-amber-600" />
              ) : (
                <CheckCircle2 size={20} className="text-emerald-600" />
              )}
              <div>
                <p className="text-xs font-extrabold">
                  {!dealsEnabled
                    ? 'Section is DISABLED: Hidden from home page.'
                    : isDealsExpired
                      ? 'Timer is EXPIRED: Daily Deals section is automatically hidden from home page.'
                      : `Section is LIVE on homepage: Timer expires in ${String(dealsHoursLeft)}h ${String(dealsMinutesLeft)}m.`}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Rule applied: If disabled or the time limit has passed, the entire section will
                  not appear on the storefront.
                </p>
              </div>
            </div>

            {dealsEndTime && (
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-white/70 border border-current">
                Ends: {new Date(dealsEndTime).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-wellness-gray-100">
            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Section Headline Title
              </label>
              <input
                type="text"
                placeholder="e.g. Daily Clinical Deals"
                value={dealsTitle}
                onChange={(e) => {
                  setDealsTitle(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Deal Discount Tag / Badge
              </label>
              <input
                type="text"
                placeholder="e.g. Save 25% Today, Limited Time Offers"
                value={dealsDiscountText}
                onChange={(e) => {
                  setDealsDiscountText(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Section Subtitle / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Exclusive daily discounts on essential medications and healthcare formulations."
                value={dealsDescription}
                onChange={(e) => {
                  setDealsDescription(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Deal Discount Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={99}
                  placeholder="25"
                  value={dealsDiscountPercentage || ''}
                  onChange={(e) => {
                    setDealsDiscountPercentage(Number(e.target.value));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-wellness-charcoal/40">
                  % OFF
                </span>
              </div>
              <p className="text-[10px] text-wellness-charcoal/50 mt-1">
                Used to calculate deal pricing and discount badges across daily deal products.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-wellness-navy uppercase tracking-wider mb-2">
                Countdown Timer End Date & Time Limit
              </label>
              <input
                type="datetime-local"
                value={dealsEndTime}
                onChange={(e) => {
                  setDealsEndTime(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-xl border border-wellness-gray-200 bg-wellness-gray-50 focus:border-wellness-green outline-none text-xs font-semibold font-mono"
              />
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] font-bold text-wellness-charcoal/50">Quick set:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDealsHoursFromNow(12);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-wellness-gray-100 hover:bg-wellness-green hover:text-white text-[10px] font-bold text-wellness-navy transition-colors cursor-pointer"
                >
                  +12h
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDealsHoursFromNow(24);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-wellness-gray-100 hover:bg-wellness-green hover:text-white text-[10px] font-bold text-wellness-navy transition-colors cursor-pointer"
                >
                  +24h (1 day)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDealsHoursFromNow(72);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-wellness-gray-100 hover:bg-wellness-green hover:text-white text-[10px] font-bold text-wellness-navy transition-colors cursor-pointer"
                >
                  +3 days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDealsHoursFromNow(168);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-wellness-gray-100 hover:bg-wellness-green hover:text-white text-[10px] font-bold text-wellness-navy transition-colors cursor-pointer"
                >
                  +7 days
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-wellness-gray-100 flex justify-end">
            <button
              type="button"
              disabled={savingDeals}
              onClick={() => {
                void handleSaveDeals();
              }}
              className="bg-wellness-green hover:bg-wellness-navy text-white text-xs font-black uppercase tracking-wider px-8 py-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={15} />
              {savingDeals ? 'Saving Deals...' : 'Save Daily Deals & Timer'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
