import React from 'react';

const ActivitySkeleton: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div>
            <div className="bg-gray-200 h-6 w-1/3 rounded mb-4"></div>
            <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                    <div>
                        <div className="bg-gray-200 h-5 rounded w-64 mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-32"></div>
                    </div>
                    <div className="bg-gray-200 h-4 rounded w-24"></div>
                </div>
            </div>
        </div>
        <div>
            <div className="bg-gray-200 h-6 w-1/3 rounded mb-4"></div>
            <div className="space-y-4">
                 <div className="flex items-center space-x-4 py-3">
                    <div className="bg-gray-200 h-16 w-16 rounded flex-shrink-0"></div>
                    <div className="flex-grow space-y-2">
                        <div className="bg-gray-200 h-5 rounded w-48"></div>
                        <div className="bg-gray-200 h-4 rounded w-24"></div>
                    </div>
                    <div className="bg-gray-200 h-8 rounded-full w-20"></div>
                </div>
            </div>
        </div>
    </div>
);

export default ActivitySkeleton;
