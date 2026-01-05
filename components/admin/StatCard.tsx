import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    caption: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, caption }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{caption}</p>
            </div>
        </div>
    );
};

export default StatCard;
