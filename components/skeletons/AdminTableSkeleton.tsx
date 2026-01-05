import React from 'react';

interface AdminTableSkeletonProps {
    rows?: number;
    cols?: number;
}

const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({ rows = 5, cols = 5 }) => {
    return (
        <div className="overflow-x-auto animate-pulse">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {Array.from({ length: cols }).map((_, i) => (
                             <th key={i} scope="col" className="px-6 py-3">
                                 <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                             </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="bg-white border-b">
                            {Array.from({ length: cols }).map((_, j) => (
                                <td key={j} className="px-6 py-4">
                                     <div className={`bg-gray-200 h-5 rounded ${j === 0 ? 'w-full' : 'w-3/4'}`}></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTableSkeleton;
