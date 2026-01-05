
import React from 'react';
import type { Testimonial } from '../types';
import { QuoteIcon } from './icons';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="flex-shrink-0">
      <QuoteIcon className="h-8 w-8 text-primary-200" />
    </div>
    <p className="mt-4 text-gray-600 flex-grow">"{testimonial.quote}"</p>
    <div className="mt-6 flex items-center">
      <img
        src={testimonial.image}
        alt={testimonial.author}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="ml-4">
        <p className="font-bold text-gray-800">{testimonial.author}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
