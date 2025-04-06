import { LoanDetails, LoanSummary, AmortizationEntry } from '@/app/lib/loanCalculator';

interface DashboardProps {
    loanDetails: LoanDetails;
    loanSummary: LoanSummary;
}

export default function Dashboard({ loanDetails, loanSummary }: DashboardProps) {
    const paidEMIs = loanSummary.amortizationSchedule.filter(e => e.status === 'paid').length;
    const pendingEMIs = loanSummary.amortizationSchedule.length - paidEMIs;
    const totalPaid = loanSummary.amortizationSchedule
        .filter(e => e.status === 'paid')
        .reduce((sum, e) => sum + e.payment, 0);

    const nextDue = loanSummary.amortizationSchedule.find(e => e.status === 'pending');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Loan Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Monthly EMI</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${loanSummary.monthlyEMI.toFixed(2)}
                    </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Total Interest</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${loanSummary.totalInterest.toFixed(2)}
                    </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Payment</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ${loanSummary.totalPayment.toFixed(2)}
                    </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Loan Tenure</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {loanSummary.loanTenureMonths === 1 ? '1 month' : `${loanSummary.loanTenureMonths} months`}
                        {/* This will display "1 month" or "X months" */}
                    </p>
                    {loanSummary.loanTenureMonths >= 12 && (
                        <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                            ({Math.floor(loanSummary.loanTenureMonths / 12)} year
                            {Math.floor(loanSummary.loanTenureMonths / 12) !== 1 ? 's' : ''})
                        </p>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Payment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid EMIs</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{paidEMIs}</p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining EMIs</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingEMIs}</p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Paid</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">${totalPaid.toFixed(2)}</p>
                </div>
            </div>

            {nextDue && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2">Next Payment Due</h3>
                    <p className="text-amber-600 dark:text-amber-300">
                        ${nextDue.payment.toFixed(2)} on {new Date(nextDue.date).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
}