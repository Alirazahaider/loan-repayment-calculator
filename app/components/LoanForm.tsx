import { useState } from 'react';
import { LoanDetails } from '@/app/lib/loanCalculator';

interface LoanFormProps {
    onSubmit: (details: LoanDetails) => void;
}

export default function LoanForm({ onSubmit }: LoanFormProps) {
    const [formData, setFormData] = useState<LoanDetails>({
        amount: 1000,
        interestRate: 10,
        tenure: 1,
        startDate: new Date().toISOString().split('T')[0],
        isYears: false // Default to months
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'select-one'
                ? value === 'true' // Convert string 'true'/'false' to boolean
                : type === 'number'
                    ? parseFloat(value) || 0 // Ensure we always have a number
                    : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure tenure is at least 1 month/year
        const validatedData = {
            ...formData,
            tenure: Math.max(1, formData.tenure),
            amount: Math.max(1, formData.amount),
            interestRate: Math.max(0.01, formData.interestRate)
        };

        onSubmit(validatedData);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Loan Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Loan Amount ($)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            step="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Annual Interest Rate (%)
                        </label>
                        <input
                            type="number"
                            name="interestRate"
                            value={formData.interestRate}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0.01"
                            max="100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Loan Tenure
                        </label>
                        <div className="flex flex-col md:flex-row gap-2">
                            <input
                                type="number"
                                name="tenure"
                                value={formData.tenure}
                                onChange={handleChange}
                                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                required
                            />
                            <select
                                name="isYears"
                                value={formData.isYears.toString()} // Convert boolean to string
                                onChange={handleChange}
                                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="false">Months</option>
                                <option value="true">Years</option>
                            </select>
                        </div>
                        {/* Display the current tenure mode */}
                        <p className="text-xs text-gray-500 mt-1">
                            Current: {formData.isYears ? 'Years' : 'Months'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Calculate EMI
                    </button>
                </div>
            </form>
        </div>
    );
}