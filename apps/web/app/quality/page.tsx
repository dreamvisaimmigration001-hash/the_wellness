'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  ShieldCheck,
  CheckCircle,
  Microscope,
  FlaskConical,
  Award,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  Globe2,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function QualityPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.quality-hero', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'all',
      });

      gsap.fromTo(
        '.quality-card',
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.quality-grid',
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'all',
        },
      );

      const progressBars = gsap.utils.toArray<HTMLElement>('.progress-fill');
      progressBars.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width');
        if (!targetWidth) return;
        gsap.to(bar, {
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            once: true,
          },
          width: targetWidth,
          duration: 1.5,
          ease: 'power3.out',
        });
      });

      gsap.fromTo(
        '.process-step',
        { x: -30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.process-section',
            start: 'top 80%',
            once: true,
          },
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'all',
        },
      );

      gsap.fromTo(
        '.cert-card',
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.cert-section',
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        },
      );

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    },
    { scope: container },
  );

  return (
    <div ref={container} className="bg-wellness-white min-h-screen pt-12">
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <div className="quality-hero max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto bg-wellness-green/10 rounded-full flex items-center justify-center mb-8">
            <ShieldCheck className="text-wellness-green" size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-wellness-navy mb-6 tracking-tight">
            Every product is held to a higher standard.
          </h1>
          <p className="text-xl text-wellness-charcoal/70 leading-relaxed max-w-2xl mx-auto">
            Quality is not an afterthought; it is the foundation of our entire process. We exceed
            industry standards to ensure safety, purity, and efficacy.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mb-24">
        <div className="quality-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <CheckCircle size={24} />,
              title: 'cGMP Certified',
              desc: 'Manufactured in FDA-registered, cGMP-certified facilities.',
            },
            {
              icon: <Microscope size={24} />,
              title: 'Purity Testing',
              desc: 'Raw materials tested for heavy metals, microbes, and allergens.',
            },
            {
              icon: <FlaskConical size={24} />,
              title: 'Potency Validation',
              desc: 'Post-production analysis ensures label claims match active ingredients.',
            },
            {
              icon: <ShieldCheck size={24} />,
              title: 'Traceability',
              desc: 'End-to-end tracking from source ingredient to final bottled product.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="quality-card bg-white p-8 rounded-2xl shadow-sm border border-wellness-gray-100 text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-wellness-navy text-white flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-wellness-navy mb-3">
                {item.title}
              </h3>
              <p className="text-wellness-charcoal/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-wellness-navy text-white py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-8">Our Quality Metrics</h2>
              <p className="text-white/70 mb-12 leading-relaxed">
                We measure our success not just by sales, but by the consistent, unyielding quality
                of every batch we produce. Our rejection rate for sub-standard raw materials is
                higher than the industry average, because your health demands it.
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Raw Material Acceptance Rate</span>
                    <span className="text-wellness-green">42%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="progress-fill h-full bg-wellness-green w-0"
                      data-width="42%"
                    ></div>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    We reject 58% of sourced materials that fail our strict purity standards.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Third-Party Testing Compliance</span>
                    <span className="text-wellness-green">100%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="progress-fill h-full bg-wellness-green w-0"
                      data-width="100%"
                    ></div>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Every single batch is independently verified.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              <Image
                src="/images/quality/lab_facility.jpg"
                alt="Quality Control Laboratory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="process-section py-24 bg-wellness-gray-50 border-y border-wellness-gray-200">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-wellness-green font-bold tracking-wider uppercase text-sm mb-4 block">
              The Wellness Standard
            </span>
            <h2 className="text-4xl font-heading font-bold text-wellness-navy mb-4">
              5-Step Assurance Process
            </h2>
            <p className="text-lg text-wellness-charcoal/70">
              From seed to shelf, our rigorous protocol guarantees uncompromising excellence.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                num: '01',
                title: 'Global Sourcing Verification',
                desc: 'We audit every supplier on-site. Raw materials are quarantined upon arrival until they pass our initial identity and purity tests.',
              },
              {
                num: '02',
                title: 'Contaminant Screening',
                desc: 'Utilizing High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry to detect traces of heavy metals, pesticides, and microbial growth.',
              },
              {
                num: '03',
                title: 'Precision Blending',
                desc: 'Ingredients are mixed in climate-controlled, positive-pressure cleanrooms to prevent cross-contamination and ensure uniform distribution.',
              },
              {
                num: '04',
                title: 'In-Process Quality Checks',
                desc: 'Every 30 minutes during production, samples are pulled from the line to verify weight, disintegration rates, and visual consistency.',
              },
              {
                num: '05',
                title: 'Final Lot Release',
                desc: 'A dedicated QA team reviews all batch records and third-party lab results before a single bottle is approved for distribution.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="process-step flex items-start gap-6 bg-white p-8 rounded-2xl shadow-sm border border-wellness-gray-100"
              >
                <div className="text-3xl font-heading font-black text-wellness-green/20 mt-1">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-wellness-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-wellness-charcoal/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Certifications Redesigned Section */}
      <section className="cert-section py-24 bg-gradient-to-b from-wellness-white via-white to-wellness-gray-50 border-t border-wellness-gray-200/70 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-wellness-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-wellness-navy/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Section Eyebrow & Header */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wellness-green/10 border border-wellness-green/20 text-wellness-green text-xs font-black tracking-widest uppercase mb-4 shadow-xs">
              <Award size={14} className="stroke-[2.5]" />
              <span>Accreditations & Compliance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-wellness-navy tracking-tight">
              Global Certifications & Quality Compliance
            </h2>
            <p className="mt-4 text-sm sm:text-base text-wellness-charcoal/70 leading-relaxed font-medium">
              Our formulation facilities, cleanroom production lines, and cold-chain distribution
              pipelines are continuously certified and audited by the world’s leading pharmaceutical
              and health safety authorities.
            </p>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
            {[
              {
                icon: Globe2,
                name: 'WHO-GMP Certified',
                authority: 'World Health Organization',
                badge: 'TRS 986 / Annex 2',
                status: 'Global Standard',
                desc: 'Good Manufacturing Practices ensuring zero microbial contamination, validated cleanroom ventilation, and sterile active compounding.',
                scope: 'Active Cleanroom Grade A/B Operations',
                audit: 'Annual Global Surveillance Audit',
              },
              {
                icon: Building2,
                name: 'FDA Registered Facility',
                authority: 'U.S. Food & Drug Administration',
                badge: '21 CFR Part 111 & 211',
                status: 'Federal Compliance',
                desc: 'Federal oversight covering active ingredient identity confirmation, sanitation validation, and clean-label potency assurance.',
                scope: 'Dietary & OTC Therapeutics Facility',
                audit: 'Continuous Regulatory Oversight',
              },
              {
                icon: CheckCircle2,
                name: 'ISO 9001 & ISO 22000',
                authority: 'Intl. Organization for Standardization',
                badge: 'Cert #QMS-90412',
                status: 'Accredited System',
                desc: 'Global benchmark for systemic pharmaceutical risk mitigation, quality management systems, and transparent batch tracking.',
                scope: 'End-to-End Traceability & Systems',
                audit: 'Bi-Annual External Surveillance',
              },
              {
                icon: FlaskConical,
                name: 'NSF International cGMP',
                authority: 'NSF Health Sciences',
                badge: 'NSF/ANSI 173 Standard',
                status: 'Independently Tested',
                desc: 'Toxicological evaluation and batch dissolution verification, certifying complete absence of undeclared substances or heavy metal toxins.',
                scope: 'Finished Lot Release & Purity',
                audit: 'Unannounced Facility Inspections',
              },
              {
                icon: ShieldCheck,
                name: 'EU GDP Cold-Chain',
                authority: 'European Medicines Agency',
                badge: 'Guideline 2013/C 343/01',
                status: 'IoT Monitored',
                desc: 'Continuous real-time telemetric climate control (-20°C to 25°C) across domestic and international transit to protect bio-integrity.',
                scope: 'Cold-Chain Logistics & Storage',
                audit: '24/7 Digital Telemetry Logs',
              },
              {
                icon: Microscope,
                name: 'Third-Party Lab Tested',
                authority: 'ISO/IEC 17025 Accredited Labs',
                badge: 'HPLC & Mass Spec',
                status: '100% Lots Verified',
                desc: 'Every single batch undergoes blind third-party testing for chemical identity, potency, microbials, residual solvents, and pesticides.',
                scope: 'Purity, Potency & Stability Assay',
                audit: '100% Production Batches Tested',
              },
            ].map((cert, idx) => {
              const IconComp = cert.icon;
              return (
                <div
                  key={idx}
                  className="cert-card group relative bg-white rounded-3xl p-6 sm:p-8 border border-wellness-gray-200/80 shadow-xs hover:shadow-xl hover:border-wellness-green/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left"
                >
                  {/* Top glowing edge highlight on hover */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-wellness-green to-wellness-navy absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Card Header: Icon + Status Pill */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-wellness-navy text-wellness-green flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <IconComp size={22} className="stroke-[2.2]" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {cert.status}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-heading font-black text-wellness-navy group-hover:text-wellness-green transition-colors">
                          {cert.name}
                        </h3>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-wellness-charcoal/50">
                        {cert.authority}
                      </p>
                    </div>

                    {/* Standard / Code Badge */}
                    <div className="inline-block bg-wellness-gray-50 border border-wellness-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold text-wellness-navy mb-4">
                      {cert.badge}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-wellness-charcoal/70 leading-relaxed font-medium mb-6">
                      {cert.desc}
                    </p>
                  </div>

                  {/* Card Meta Footer */}
                  <div className="pt-4 border-t border-wellness-gray-100 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between text-wellness-charcoal/60">
                      <span className="font-semibold">Scope:</span>
                      <span className="font-bold text-wellness-navy text-right">{cert.scope}</span>
                    </div>
                    <div className="flex items-center justify-between text-wellness-charcoal/60">
                      <span className="font-semibold">Audit Cycle:</span>
                      <span className="font-bold text-wellness-green text-right">{cert.audit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificate of Analysis / Dossier Request Banner */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-wellness-navy text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-wellness-green/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 text-left relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-wellness-green/20 text-wellness-green flex items-center justify-center shrink-0 border border-wellness-green/30">
                <FileCheck size={24} />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-heading font-extrabold text-white">
                  Need Batch-Specific Verification?
                </h4>
                <p className="text-xs text-white/70 font-medium mt-0.5">
                  Download third-party Certificates of Analysis (CoA) or request regulatory audit
                  dossiers for any production lot.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="px-5 py-3 rounded-xl bg-wellness-green hover:bg-white hover:text-wellness-navy text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 flex items-center gap-2 shadow-md cursor-pointer relative z-10"
            >
              <span>Request Lot Dossier</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
