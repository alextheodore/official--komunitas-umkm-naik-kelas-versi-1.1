
import React from 'react';
import { Link } from 'react-router-dom';
import type { Feature } from '../types';

const FeatureCard: React.FC<{feature: Feature}> = ({feature}) => {
    
    const getLink = () => {
        switch (feature.title) {
            case 'Forum Diskusi':
                return '/programs#forum';
            case 'Event & Pelatihan':
                return '/programs#events';
            case 'Networking':
                return '/programs#networking';
            case 'Marketplace':
                return '/marketplace'; // This one has its own page
            default:
                return '/programs';
        }
    };

    const linkTo = getLink();

    return (
    <Link to={linkTo} className="block bg-white p-6 rounded-lg shadow-md h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-500 mb-5">
            {feature.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
        <p className="mt-2 text-gray-600">{feature.description}</p>
        <p className="mt-4 inline-block text-primary-600 font-semibold hover:text-primary-700">Pelajari Lebih Lanjut &rarr;</p>
    </Link>
    );
};

export default FeatureCard;
