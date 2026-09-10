'use client';

import {
  Briefcase,
  Globe2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Mail,
  Building2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface Position {
  id: string;
  title: string;
  department: 'Research & Clinical' | 'Engineering' | 'Operations' | 'Quality & Regulatory';
  location: string;
  type: 'Full-time' | 'Hybrid' | 'Remote';
  experience: string;
  description: string;
  requirements: string[];
}

const POSITIONS: Position[] = [
  {
    id: 'clin-sci-1',
    title: 'Senior Clinical Research Scientist',
    department: 'Research & Clinical',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: '5+ years',
    description:
      'Lead design and protocol execution for human clinical trials evaluating novel botanical extracts and bio-identical micronutrients.',
    requirements: [
      'Ph.D. or M.D. in Pharmacology, Biochemistry, or related clinical field',
      'Track record of peer-reviewed clinical trial management',
      'Deep knowledge of FDA 21 CFR Part 312 guidelines',
    ],
  },
  {
    id: 'form-chem-2',
    title: 'Senior Formulation Chemist',
    department: 'Research & Clinical',
    location: 'Geneva, Switzerland',
    type: 'Full-time',
    experience: '4+ years',
    description:
      'Optimize bioavailability, dissolution profiles, and stability across liquid suspension and solid-dose pharmaceutical grade capsules.',
    requirements: [
      'M.S. or Ph.D. in Pharmaceutical Sciences or Chemistry',
      'Extensive experience with HPLC, LC-MS, and dissolution testing apparatus',
      'Experience scaling formulations from benchtop to cGMP pilot lines',
    ],
  },
  {
    id: 'health-eng-3',
    title: 'Staff Full-Stack HealthTech Engineer',
    department: 'Engineering',
    location: 'Remote (US / Global)',
    type: 'Remote',
    experience: '6+ years',
    description:
      'Architect resilient web and digital health tools delivering personalized clinical guidance, authenticated patient workflows, and seamless inventory tracking.',
    requirements: [
      'Mastery of TypeScript, Next.js, Node.js, and high-throughput databases',
      'Familiarity with HIPAA / GDPR compliance in patient health records',
      'Passion for pristine UI craftsmanship and performant distributed architectures',
    ],
  },
  {
    id: 'reg-mgr-4',
    title: 'Regulatory Affairs & Compliance Director',
    department: 'Quality & Regulatory',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    experience: '7+ years',
    description:
      'Oversee international registrations, cGMP documentation audits, and post-market safety surveillance across North America and Europe.',
    requirements: [
      'Extensive leadership in FDA, EMA, and WHO-GMP audit readiness',
      'Expertise in electronic Common Technical Document (eCTD) submissions',
      'Superb cross-functional leadership and risk evaluation skills',
    ],
  },
  {
    id: 'supply-coord-5',
    title: 'Global Supply Chain & Logistics Lead',
    department: 'Operations',
    location: 'New Delhi Hub, India',
    type: 'Full-time',
    experience: '4+ years',
    description:
      'Manage temperature-controlled pharmaceutical supply lines, customs clearances, and regional distribution to over 50 export markets.',
    requirements: [
      'Proven background in Cold Chain distribution and pharmaceutical freight logistics',
      'Strong ERP/WMS systems management capabilities',
      'Experience negotiating with tier-1 carriers and regional third-party logistics (3PL)',
    ],
  },
];

const PERKS = [
  {
    icon: HeartHandshake,
    title: 'Premium Health & Wellness',
    desc: 'Comprehensive 100% employer-covered health, dental, and vision, plus annual wellness product allotments.',
  },
  {
    icon: GraduationCap,
    title: 'Research & Education Grants',
    desc: '$3,500 annual stipend for continuing education, medical conferences, certifications, and research publishing.',
  },
  {
    icon: Globe2,
    title: 'Flexible & Global Work',
    desc: 'Remote-friendly culture with modern hub offices in San Francisco, Geneva, and Delhi, plus flexible working hours.',
  },
  {
    icon: Building2,
    title: 'State-of-the-Art Labs',
    desc: 'Access to ISO-certified laboratories, modern analytical equipment, and ergonomic high-spec workstations.',
  },
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeModalPosition, setActiveModalPosition] = useState<Position | null>(null);

  const departments = [
    'All',
    'Research & Clinical',
    'Engineering',
    'Operations',
    'Quality & Regulatory',
  ];

  const filteredPositions =
    selectedDept === 'All' ? POSITIONS : POSITIONS.filter((p) => p.department === selectedDept);

  return (
    <div className="bg-wellness-white min-h-screen pt-12 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 max-w-6xl mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wellness-green/10 text-wellness-navy text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-wellness-green" />
            Careers at The Wellness
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-wellness-navy tracking-tight leading-tight mb-6">
            Build the Future of <br className="hidden sm:inline" />
            <span className="text-wellness-green">Scientific Wellness</span>
          </h1>
          <p className="text-lg text-wellness-charcoal/70 leading-relaxed mb-8">
            We are a team of clinicians, researchers, pharmacists, and technologists committed to
            transforming healthcare. Join our mission to deliver pure, clinically validated
            therapies to millions worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#open-positions"
              className="bg-wellness-navy hover:bg-wellness-green text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              Explore Open Positions <ArrowRight size={16} />
            </a>
            <Link
              href="/about"
              className="bg-wellness-gray-100 hover:bg-wellness-gray-200 text-wellness-navy font-bold text-sm px-8 py-3.5 rounded-xl transition-all"
            >
              Our Story & Leadership
            </Link>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-wellness-gray-200">
          <div className="text-center">
            <p className="text-4xl font-heading font-extrabold text-wellness-navy">50+</p>
            <p className="text-xs uppercase tracking-wider text-wellness-charcoal/60 font-semibold mt-1">
              Global Markets Served
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-heading font-extrabold text-wellness-navy">100%</p>
            <p className="text-xs uppercase tracking-wider text-wellness-charcoal/60 font-semibold mt-1">
              Batch Testing Verification
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-heading font-extrabold text-wellness-navy">3</p>
            <p className="text-xs uppercase tracking-wider text-wellness-charcoal/60 font-semibold mt-1">
              R&D Facilities Worldwide
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-heading font-extrabold text-wellness-navy">99.4%</p>
            <p className="text-xs uppercase tracking-wider text-wellness-charcoal/60 font-semibold mt-1">
              Patient Satisfaction Rate
            </p>
          </div>
        </div>
      </section>

      {/* Perks & Culture */}
      <section className="bg-wellness-gray-50 py-20 border-y border-wellness-gray-200 mb-20">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-wellness-navy mb-4">
              Why Join The Wellness
            </h2>
            <p className="text-wellness-charcoal/70 text-sm md:text-base">
              We empower our team with the autonomy, scientific resources, and wellness benefits
              needed to do the best work of their lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl border border-wellness-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-wellness-green/10 text-wellness-green flex items-center justify-center mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-wellness-navy mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-wellness-charcoal/70 leading-relaxed font-medium">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section
        id="open-positions"
        className="container mx-auto px-6 md:px-12 max-w-6xl mb-20 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-wellness-navy mb-2">
              Current Openings
            </h2>
            <p className="text-wellness-charcoal/70 text-sm">
              Discover opportunities to contribute your expertise to our clinical and operational
              mission.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-wellness-navy text-white shadow-sm'
                    : 'bg-wellness-gray-100 text-wellness-charcoal/70 hover:bg-wellness-gray-200 hover:text-wellness-navy'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Positions List */}
        <div className="space-y-4">
          {filteredPositions.map((pos) => (
            <div
              key={pos.id}
              className="bg-white p-6 md:p-8 rounded-2xl border border-wellness-gray-200 hover:border-wellness-green/60 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-wellness-gray-100 text-wellness-navy">
                      {pos.department}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-wellness-charcoal/70 font-medium">
                      <MapPin size={13} className="text-wellness-green" /> {pos.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-wellness-charcoal/70 font-medium">
                      <Clock size={13} className="text-wellness-green" /> {pos.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-wellness-charcoal/70 font-medium">
                      <Briefcase size={13} className="text-wellness-green" /> {pos.experience}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-wellness-navy group-hover:text-wellness-green transition-colors">
                    {pos.title}
                  </h3>
                  <p className="text-sm text-wellness-charcoal/70 leading-relaxed">
                    {pos.description}
                  </p>
                </div>

                <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button
                    onClick={() => setActiveModalPosition(pos)}
                    className="bg-wellness-navy hover:bg-wellness-green text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View Details & Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spontaneous Application Banner */}
        <div className="mt-12 bg-wellness-navy text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">
              Don’t see a role that matches your background?
            </h3>
            <p className="text-sm text-wellness-light-green/80 leading-relaxed mb-6">
              We are constantly seeking outstanding clinicians, organic chemists, data scientists,
              and healthcare professionals. Send your CV and research summary to our recruitment
              committee.
            </p>
            <a
              href="mailto:careers@thewellness.com?subject=Spontaneous%20Application%20-%20The%20Wellness"
              className="inline-flex items-center gap-2 bg-wellness-green hover:bg-wellness-green/90 text-wellness-navy font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
            >
              <Mail size={16} />
              Email careers@thewellness.com
            </a>
          </div>
        </div>
      </section>

      {/* Detail & Application Modal */}
      {activeModalPosition && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative border border-wellness-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-wellness-gray-100 text-wellness-navy inline-block mb-2">
                  {activeModalPosition.department}
                </span>
                <h3 className="text-2xl font-heading font-bold text-wellness-navy">
                  {activeModalPosition.title}
                </h3>
                <p className="text-xs text-wellness-charcoal/60 mt-1">
                  {activeModalPosition.location} &bull; {activeModalPosition.type} &bull; Exp:{' '}
                  {activeModalPosition.experience}
                </p>
              </div>
              <button
                onClick={() => setActiveModalPosition(null)}
                className="text-wellness-charcoal/50 hover:text-wellness-navy font-bold text-xl p-2 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 text-sm text-wellness-charcoal/80">
              <div>
                <h4 className="font-heading font-bold text-wellness-navy mb-2">Role Overview</h4>
                <p className="leading-relaxed">{activeModalPosition.description}</p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-wellness-navy mb-3">Key Requirements</h4>
                <ul className="space-y-2">
                  {activeModalPosition.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-wellness-green shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-wellness-gray-50 rounded-2xl border border-wellness-gray-200">
                <h4 className="font-heading font-bold text-wellness-navy mb-2">How to Apply</h4>
                <p className="text-xs text-wellness-charcoal/70 leading-relaxed mb-4">
                  Please submit your CV along with relevant publication links or your portfolio to
                  our talent team. Include the role title in your subject line.
                </p>
                <a
                  href={`mailto:careers@thewellness.com?subject=${encodeURIComponent(
                    `Application for ${activeModalPosition.title} [${activeModalPosition.id}]`,
                  )}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-wellness-navy hover:bg-wellness-green text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer text-center"
                >
                  <Mail size={16} />
                  Submit Application via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
