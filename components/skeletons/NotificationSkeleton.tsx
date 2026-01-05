import React from 'react';

const NotificationSkeleton: React.FC = () => (
    <div className="flex items-start space-x-4 p-4 animate-pulse">
        <div className="flex-grow space-y-2">
            <div className="bg-gray-200 h-5 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
        <div className="bg-gray-200 h-4 w-1/5 rounded self-center"></div>
    </div>
);

export default NotificationSkeleton;
