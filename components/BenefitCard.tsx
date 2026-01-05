
import React from 'react';
import type { Benefit } from '../types';

const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => (
    <div className="text-center p-6 bg-gray-50 rounded-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex justify-center items-center mb-4 h-16 w-16 rounded-full bg-primary-100 mx-auto flex-shrink-0">
           {benefit.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{benefit.title}</h3>
        <p className="mt-2 text-gray-600 flex-grow">{benefit.description}</p>
    </div>
);

export default BenefitCard;
