import { useState } from 'react';

import { AmortizationEntry } from '@/app/lib/loanCalculator';

interface PaymentTrackerProps {
    schedule: AmortizationEntry[];
    onUpdate: (updatedSchedule: AmortizationEntry[]) => void;
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

export default function PaymentTracker({ schedule, onUpdate }: PaymentTrackerProps) {

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedDate, setEditedDate] = useState<string>('');
    const [editedAmount, setEditedAmount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    // Calculate pagination
    const totalPages = Math.ceil(schedule.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schedule.slice(indexOfFirstItem, indexOfLastItem);

    const handlePaymentToggle = (month: number) => {
        const updated = schedule.map(entry => {
            if (entry.month === month) {
                return createAmortizationEntry(
                    {
                        month: entry.month,
                        date: entry.date,
                        payment: entry.payment,
                        interest: entry.interest,
                        principal: entry.principal,
                        remainingBalance: entry.remainingBalance
                    },
                    entry.status === 'paid' ? 'pending' : 'paid'
                );
            }
            return entry;
        });
        onUpdate(updated);
    };

    const startEdit = (entry: AmortizationEntry) => {
        setEditingId(entry.month);
        setEditedDate(entry.date);
        setEditedAmount(entry.payment);
    };

    const saveEdit = () => {
        if (!editingId) return;

        const updated = schedule.map(entry => {
            if (entry.month === editingId) {
                return createAmortizationEntry(
                    {
                        month: entry.month,
                        date: editedDate,
                        payment: editedAmount,
                        interest: entry.interest,
                        principal: editedAmount - entry.interest,
                        remainingBalance: Math.max(0, entry.remainingBalance + (entry.payment - editedAmount))
                    },
                    entry.status
                );
            }
            return entry;
        });

        onUpdate(updated);
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };



    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Payment Tracker ({schedule.length} total payments)
            </h2>
            
          

            {/* Items per page selector */}
            <div className=" flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 mb-4">
                <div className="flex  items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value={schedule.length}>All</option>
                    </select>
                    <span className="text-sm text-gray-600 dark:text-gray-300">payments per page</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </div>
            </div>

            {/* Payments List */}
            <div className="space-y-4 mb-4">
                {currentItems.map(entry => (
                    <div
                        key={entry.month}
                        className="overflow-x-auto md:overflow-hidden justify-items-start grid md:flex items-center space-y-5 md:space-y-0 md:justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                        <div className="flex items-center space-x-4">
                            <span className={`inline-block w-3 h-3 rounded-full ${entry.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'
                                }`}></span>
                            <div>
                                <span className="text-gray-800 dark:text-white">Month {entry.month}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(entry.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            <span className="font-medium text-gray-800 dark:text-white">
                                ${entry.payment.toFixed(2)}
                            </span>

                            {editingId === entry.month ? (
                                <div className="flex space-x-2">
                                    <input
                                        type="date"
                                        value={editedDate}
                                        onChange={(e) => setEditedDate(e.target.value)}
                                        className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <input
                                        type="number"
                                        value={editedAmount}
                                        onChange={(e) => setEditedAmount(parseFloat(e.target.value))}
                                        className="text-sm border rounded px-2 py-1 w-20 dark:bg-gray-700 dark:border-gray-600"
                                        step="0.01"
                                    />
                                    <button
                                        onClick={saveEdit}
                                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-2 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePaymentToggle(entry.month)}
                                        className={`text-sm px-3 py-1 rounded ${entry.status === 'paid'
                                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                    >
                                        {entry.status === 'paid' ? 'Undo' : 'Mark Paid'}
                                    </button>
                                    <button
                                        onClick={() => startEdit(entry)}
                                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mt-4">
                <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${currentPage === 1
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    Previous
                </button>

                <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`w-10 h-10 rounded-md ${currentPage === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2 py-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                            onClick={() => paginate(totalPages)}
                            className={`w-10 h-10 rounded-md ${currentPage === totalPages
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                                }`}
                        >
                            {totalPages}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    Next
                </button>
            </div>

            {/* Quick Jump */}
            <div className="mt-4 flex justify-end">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Go to:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        defaultValue={currentPage}
                        onChange={(e) => {
                            const page = Math.min(totalPages, Math.max(1, Number(e.target.value)));
                            setCurrentPage(page);
                        }}
                        className="w-16 text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">of {totalPages}</span>
                </div>
            </div>
           
        </div>

        
    );
}