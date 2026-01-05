import React from 'react';

const AdminStatCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-6 animate-pulse">
        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200"></div>
        <div className="w-full">
            <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
            <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
            <div className="bg-gray-200 h-3 w-3/4 rounded mt-2"></div>
        </div>
    </div>
);

export default AdminStatCardSkeleton;
