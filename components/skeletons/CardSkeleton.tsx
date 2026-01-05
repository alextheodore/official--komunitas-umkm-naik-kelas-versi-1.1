import React from 'react';

const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
        <div className="animate-pulse flex flex-col h-full">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                    <div className="bg-gray-200 h-5 rounded w-3/4 mb-3"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-200 h-4 rounded w-full"></div>
                        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                     <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                     <div className="bg-gray-200 h-8 rounded-md w-1/4"></div>
                </div>
            </div>
        </div>
    </div>
);

export default CardSkeleton;