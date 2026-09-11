'use client';

import React from 'react';

import { Step } from '../types';

interface StepIndicatorProps {
  currentStep: Step;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6 sm:mb-12">
      <div className="flex items-center justify-between max-w-xl mx-auto px-2">
        {/* Step 1 */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors shrink-0 ${
              currentStep === 'review'
                ? 'bg-wellness-green text-white shadow-md'
                : 'bg-wellness-navy text-white'
            }`}
          >
            1
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-wellness-navy uppercase tracking-wider mt-1.5 sm:mt-2 text-center truncate max-w-full">
            Review & Rx
          </span>
        </div>
        <div className="flex-grow h-0.5 mx-1.5 sm:mx-4 bg-wellness-gray-200"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors shrink-0 ${
              currentStep === 'shipping'
                ? 'bg-wellness-green text-white shadow-md'
                : currentStep === 'payment'
                  ? 'bg-wellness-navy text-white'
                  : 'bg-wellness-gray-200 text-wellness-charcoal/40'
            }`}
          >
            2
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-wellness-navy uppercase tracking-wider mt-1.5 sm:mt-2 text-center truncate max-w-full">
            Shipping
          </span>
        </div>
        <div className="flex-grow h-0.5 mx-1.5 sm:mx-4 bg-wellness-gray-200"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors shrink-0 ${
              currentStep === 'payment'
                ? 'bg-wellness-green text-white shadow-md'
                : 'bg-wellness-gray-200 text-wellness-charcoal/40'
            }`}
          >
            3
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-wellness-navy uppercase tracking-wider mt-1.5 sm:mt-2 text-center truncate max-w-full">
            Payment
          </span>
        </div>
      </div>
    </div>
  );
}
