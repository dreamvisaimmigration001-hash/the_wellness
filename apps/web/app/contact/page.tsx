'use client';

import { useGSAP } from '@gsap/react';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Activity,
  Building2,
  FileText,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import DropdownField from '@/components/ui/DropdownField';
import { API_BASE_URL } from '@/lib/config';

const inquiryOptions = [
  {
    id: 'general',
    label: 'General Inquiry',
    desc: 'Questions about our brand, values, or career opportunities.',
    icon: <MessageSquare size={18} />,
  },
  {
    id: 'product',
    label: 'Product Support',
    desc: 'Help with formulations, orders, dosage, or therapeutic info.',
    icon: <Activity size={18} />,
  },
  {
    id: 'wholesale',
    label: 'Partnerships & Wholesale',
    desc: 'Inquiries about global B2B distribution, retail, and sales.',
    icon: <Building2 size={18} />,
  },
  {
    id: 'media',
    label: 'Press & Media',
    desc: 'For journalists, interview requests, and media resource kits.',
    icon: <FileText size={18} />,
  },
];

const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name is too long'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name is too long'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address format'),
  company: z.string().trim().max(100, 'Company name is too long').optional(),
  inquiryType: z.string().min(1, 'Inquiry type is required'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      inquiryType: inquiryOptions[0].id,
      message: '',
    },
  });

  const selectedInquiryId = watch('inquiryType');

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from('.contact-header', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });

        gsap.from('.contact-info > div', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2,
        });

        gsap.from('.contact-form', {
          x: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.4,
        });
      }, container);

      return () => {
        ctx.revert();
      };
    },
    { scope: container },
  );

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('submitting');

    const selectedOption =
      inquiryOptions.find((o) => o.id === data.inquiryType) || inquiryOptions[0];

    try {
      const API_BASE = API_BASE_URL;
      await fetch(`${API_BASE}/api/customer/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          company: data.company || '',
          inquiryType: selectedOption.label,
          message: data.message,
        }),
      });
    } catch (e) {
      console.error('Failed to submit inquiry to backend API:', e);
    } finally {
      setFormStatus('success');
      reset();
    }
  };

  return (
    <div ref={container} className="bg-wellness-white min-h-screen pt-12">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl pb-24">
        <div className="contact-header mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-wellness-navy tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-wellness-charcoal/70">
            Our team of specialists is ready to answer your questions and provide support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="contact-info lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-xl font-heading font-bold text-wellness-navy mb-6 flex items-center gap-2">
                <MapPin className="text-wellness-green" size={24} />
                Global Headquarters
              </h3>
              <p className="text-wellness-charcoal/70 leading-relaxed">
                123 Science Way
                <br />
                Innovation Park
                <br />
                San Francisco, CA 94107
              </p>
            </div>

            <div>
              <h3 className="text-xl font-heading font-bold text-wellness-navy mb-6 flex items-center gap-2">
                <Phone className="text-wellness-green" size={24} />
                Phone
              </h3>
              <p className="text-wellness-charcoal/70 leading-relaxed">
                Toll-Free: +1 (800) 935-5637
                <br />
                Direct/Intl: +1 (415) 890-3240
              </p>
            </div>

            <div>
              <h3 className="text-xl font-heading font-bold text-wellness-navy mb-6 flex items-center gap-2">
                <Mail className="text-wellness-green" size={24} />
                Email
              </h3>
              <p className="text-wellness-charcoal/70 leading-relaxed">
                General: hello@thewellness.com
                <br />
                Support: support@thewellness.com
                <br />
                Press: press@thewellness.com
              </p>
            </div>

            <div>
              <h3 className="text-xl font-heading font-bold text-wellness-navy mb-6 flex items-center gap-2">
                <Clock className="text-wellness-green" size={24} />
                Business Hours
              </h3>
              <p className="text-wellness-charcoal/70 leading-relaxed">
                Monday - Friday: 8:00 AM - 6:00 PM PST
                <br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-wellness-gray-100">
              {formStatus === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-wellness-green/10 text-wellness-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-wellness-navy mb-2">
                    Message Sent
                  </h3>
                  <p className="text-wellness-charcoal/70">
                    Thank you for reaching out. A specialist will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormStatus('idle');
                    }}
                    className="mt-8 text-wellness-green font-medium hover:text-wellness-navy transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    void handleSubmit(onSubmit)(e);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-wellness-navy mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        {...register('firstName')}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-wellness-gray-100/50 ${
                          errors.firstName
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-wellness-gray-200 focus:border-wellness-green focus:ring-2 focus:ring-wellness-green/20'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-wellness-navy mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        {...register('lastName')}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-wellness-gray-100/50 ${
                          errors.lastName
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-wellness-gray-200 focus:border-wellness-green focus:ring-2 focus:ring-wellness-green/20'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-wellness-navy mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-wellness-gray-100/50 ${
                          errors.email
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-wellness-gray-200 focus:border-wellness-green focus:ring-2 focus:ring-wellness-green/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-wellness-navy mb-2"
                      >
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        {...register('company')}
                        className="w-full px-4 py-3 rounded-lg border border-wellness-gray-200 focus:border-wellness-green focus:ring-2 focus:ring-wellness-green/20 outline-none transition-all bg-wellness-gray-100/50"
                      />
                    </div>
                  </div>

                  <div>
                    <DropdownField
                      label="Inquiry Type"
                      options={inquiryOptions.map((opt) => ({
                        value: opt.id,
                        label: opt.label,
                        desc: opt.desc,
                        icon: opt.icon,
                      }))}
                      selectedValue={selectedInquiryId}
                      onChange={(val) => {
                        setValue('inquiryType', val, { shouldValidate: true });
                      }}
                      required
                    />
                    {errors.inquiryType && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.inquiryType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-wellness-navy mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-wellness-gray-100/50 resize-none ${
                        errors.message
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-wellness-gray-200 focus:border-wellness-green focus:ring-2 focus:ring-wellness-green/20'
                      }`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-wellness-navy text-white py-4 rounded-lg font-medium hover:bg-wellness-green transition-colors disabled:opacity-70 flex justify-center items-center cursor-pointer"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Dropdown Accordion Section */}
      <section className="py-24 bg-wellness-gray-50 border-t border-wellness-gray-200 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wellness-green/10 border border-wellness-green/20 text-wellness-green text-xs font-black tracking-widest uppercase mb-4 shadow-xs">
              <HelpCircle size={14} className="stroke-[2.5]" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-wellness-navy mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-wellness-charcoal/70 max-w-xl mx-auto font-medium leading-relaxed">
              Explore answers to common questions regarding formulation standards, international
              shipping, orders, and career opportunities.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Where are your products manufactured?',
                a: 'All our products are manufactured in FDA-registered, cGMP-certified facilities located across the US, Switzerland, and Singapore. Every line complies with WHO cleanroom Grade A/B protocols to ensure unmatched clinical purity and safety.',
              },
              {
                q: 'Do you offer international shipping?',
                a: 'Yes, we distribute our therapeutic products and supplements globally to over 50 countries with certified temperature-controlled cold-chain shipping. Delivery timelines typically range from 2 to 6 business days depending on customs.',
              },
              {
                q: 'How can I track my prescription order?',
                a: 'Once your order is verified and dispatched from our clinical dispensary, you receive real-time tracking details via email and SMS. You can also monitor your live shipment telemetry in your patient account dashboard.',
              },
              {
                q: 'Are your supplements third-party tested?',
                a: 'Absolutely. Every single production batch undergoes comprehensive blind analytical testing by ISO/IEC 17025 accredited third-party laboratories for heavy metals, pesticides, microbial pathogens, and active ingredient potency.',
              },
              {
                q: 'How do I obtain a batch Certificate of Analysis (CoA)?',
                a: 'We provide full lot transparency. You can request the specific Certificate of Analysis for your product batch by reaching out via our contact form above or emailing qa@thewellness.com with your lot number.',
              },
              {
                q: 'How can I apply for a career or partnership at The Wellness?',
                a: 'We are always looking for passionate researchers, clinicians, and specialists. Please contact our corporate partnerships and talent team directly at partnerships@thewellness.com.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-wellness-green/40 shadow-md ring-1 ring-wellness-green/10'
                      : 'border-wellness-gray-200/80 shadow-xs hover:border-wellness-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleFaq(idx);
                    }}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-heading font-extrabold text-wellness-navy pr-2">
                      {faq.q}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-wellness-navy text-wellness-green rotate-180 shadow-xs'
                          : 'bg-wellness-gray-50 text-wellness-charcoal/60'
                      }`}
                    >
                      <ChevronDown size={18} className="stroke-[2.5]" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-wellness-gray-100/60 mt-1">
                        <p className="text-sm sm:text-base text-wellness-charcoal/70 leading-relaxed font-normal pt-3">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
