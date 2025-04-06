import { AmortizationEntry } from '@/app/lib/loanCalculator';
import { usePDF } from 'react-to-pdf';

interface AmortizationTableProps {
    schedule: AmortizationEntry[];
}

function createAmortizationEntry(
    base: Omit<AmortizationEntry, 'status'>,
    status: 'paid' | 'pending' | 'overdue'
): AmortizationEntry {
    return {
        ...base,
        status
    };
}

export default function AmortizationTable({ schedule }: AmortizationTableProps) {
    const { toPDF, targetRef } = usePDF({ 
        filename: `amortization-schedule-${new Date().toISOString().split('T')[0]}.pdf`,
        page: { 
            margin: 10,
            format: 'a4',
            orientation: 'landscape' // Better for wide tables
        }
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mt-6" ref={targetRef}>
            <div className="flex flex-row justify-between p-4 items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Table
                </h2>

                <button
                    onClick={() => toPDF()}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export PDF
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Month
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Payment Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Principal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Interest
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Remaining Balance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {schedule.map((entry) => (
                            <tr key={entry.month} className={entry.status === 'paid' ? 'bg-green-50/30 dark:bg-green-900/10' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {entry.month}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    ${entry.payment.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    ${entry.principal.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    ${entry.interest.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    ${entry.remainingBalance.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        entry.status === 'paid'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                            : entry.status === 'overdue'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                    }`}>
                                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}