import React from 'react';

const UserSkeleton: React.FC = () => (
    <div className="flex items-center justify-between p-4 animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
            <div className="space-y-2">
                <div className="bg-gray-200 h-5 w-32 rounded"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
            </div>
        </div>
        <div className="bg-gray-200 h-8 w-24 rounded-full"></div>
    </div>
);

export default UserSkeleton;
