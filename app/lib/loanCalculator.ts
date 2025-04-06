export interface LoanDetails {
    amount: number;
    interestRate: number;
    tenure: number;
    startDate: string;
    isYears: boolean;  // Changed from optional to required
  }
  
  export type PaymentStatus = 'paid' | 'pending' | 'overdue';
  
  export interface AmortizationEntry {
    month: number;
    date: string;
    payment: number;
    interest: number;
    principal: number;
    remainingBalance: number;
    status: PaymentStatus;
  }
  
  export interface LoanSummary {
    monthlyEMI: number;
    totalInterest: number;
    totalPayment: number;
    loanTenureMonths: number;  // Added explicit tenure in months
    amortizationSchedule: AmortizationEntry[];
  }
  
  export const calculateLoan = (details: LoanDetails): LoanSummary => {
    const { amount, interestRate, tenure, startDate, isYears } = details;
    
    // Validate inputs
    if (amount <= 0) throw new Error('Loan amount must be positive');
    if (interestRate <= 0) throw new Error('Interest rate must be positive');
    if (tenure <= 0) throw new Error('Tenure must be positive');
  
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = isYears ? Math.round(tenure * 12) : Math.round(tenure);
    
    // Handle 1-month loan (simple interest)
    if (totalMonths === 1) {
      const interest = parseFloat((amount * monthlyRate).toFixed(2));
      const totalPayment = parseFloat((amount + interest).toFixed(2));
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + 1);
  
      return {
        monthlyEMI: totalPayment,
        totalInterest: interest,
        totalPayment: totalPayment,
        loanTenureMonths: 1,
        amortizationSchedule: [{
          month: 1,
          date: paymentDate.toISOString().split('T')[0],
          payment: totalPayment,
          interest: interest,
          principal: amount,
          remainingBalance: 0,
          status: 'pending'
        }]
      };
    }
  
    // Standard EMI calculation
    const monthlyEMI = parseFloat((
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    ).toFixed(2));
    
    let remainingBalance = amount;
    const amortizationSchedule: AmortizationEntry[] = [];
    const start = new Date(startDate);
  
    if (isNaN(start.getTime())) throw new Error('Invalid start date');
    
    for (let month = 1; month <= totalMonths; month++) {
      const interest = parseFloat((remainingBalance * monthlyRate).toFixed(2));
      const principal = parseFloat((monthlyEMI - interest).toFixed(2));
      remainingBalance = parseFloat((remainingBalance - principal).toFixed(2));
      
      const paymentDate = new Date(start);
      paymentDate.setMonth(start.getMonth() + month - 1);
      
      amortizationSchedule.push({
        month,
        date: paymentDate.toISOString().split('T')[0],
        payment: monthlyEMI,
        interest,
        principal,
        remainingBalance: Math.max(0, remainingBalance),
        status: 'pending'
      });
    }
    
    return {
      monthlyEMI,
      totalInterest: parseFloat((monthlyEMI * totalMonths - amount).toFixed(2)),
      totalPayment: parseFloat((monthlyEMI * totalMonths).toFixed(2)),
      loanTenureMonths: totalMonths,
      amortizationSchedule
    };
  };