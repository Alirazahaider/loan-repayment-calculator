'use client';

import { useState } from 'react';
import { calculateLoan, LoanDetails, LoanSummary, AmortizationEntry } from '@/app/lib/loanCalculator';
import LoanForm from '@/app/components/LoanForm';
import Dashboard from '@/app/components/Dashboard';
import AmortizationTable from '@/app/components/AmortizationTable';
import PaymentTracker from '@/app/components/PaymentTracker';


export default function LoanTracker() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule'>('dashboard');

  const handleCalculate = (details: LoanDetails) => {
    const summary = calculateLoan(details);
    setLoanDetails(details);
    setLoanSummary(summary);
    setActiveTab('dashboard');
  };

  const handlePaymentUpdate = (updatedSchedule: AmortizationEntry[]) => {
    if (!loanSummary) return;
    
    setLoanSummary({
      ...loanSummary,
      amortizationSchedule: updatedSchedule
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LoanForm onSubmit={handleCalculate} />
          </div>
          
          <div className="lg:col-span-2">
            {loanSummary && (
              <>
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    Amortization Schedule
                  </button>
                </div>
                
                {activeTab === 'dashboard' ? (
                  <Dashboard 
                    loanDetails={loanDetails!} 
                    loanSummary={loanSummary} 
                  />
                ) : (
                  <>
                    <PaymentTracker 
                      schedule={loanSummary.amortizationSchedule} 
                      onUpdate={handlePaymentUpdate} 
                    />
                    <AmortizationTable 
                      schedule={loanSummary.amortizationSchedule} 
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}