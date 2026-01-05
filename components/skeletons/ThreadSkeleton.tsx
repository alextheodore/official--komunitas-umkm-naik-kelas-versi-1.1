import React from 'react';

const ThreadSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse flex items-start space-x-4">
        <div className="flex-shrink-0 flex flex-col items-center space-y-1">
            <div className="bg-gray-200 h-6 w-6 rounded"></div>
            <div className="bg-gray-200 h-5 w-8 rounded"></div>
            <div className="bg-gray-200 h-6 w-6 rounded"></div>
        </div>
        <div className="flex-grow space-y-3 pt-1">
            <div className="bg-gray-200 h-6 rounded w-4/5"></div>
            <div className="flex items-center space-x-2">
                <div className="bg-gray-200 h-5 w-5 rounded-full"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
        </div>
        <div className="flex-shrink-0 flex space-x-6 text-center text-sm text-gray-500">
            <div className="flex flex-col items-center space-y-2">
                <div className="bg-gray-200 h-5 w-8 rounded"></div>
                <div className="bg-gray-200 h-3 w-12 rounded"></div>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <div className="bg-gray-200 h-5 w-8 rounded"></div>
                <div className="bg-gray-200 h-3 w-12 rounded"></div>
            </div>
        </div>
    </div>
);
export default ThreadSkeleton;