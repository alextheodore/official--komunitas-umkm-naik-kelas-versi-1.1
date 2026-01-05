
import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { CalendarIcon } from './icons';

// Component to display the event category as a colored badge
const CategoryBadge: React.FC<{ category: Event['category'] }> = ({ category }) => {
    const categoryStyles: { [key in Event['category']]: string } = {
        'Webinar': 'bg-blue-100 text-blue-800',
        'Workshop': 'bg-purple-100 text-purple-800',
        'Networking': 'bg-green-100 text-green-800',
        'Kompetisi': 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyles[category] || 'bg-gray-100 text-gray-800'}`}>
            {category}
        </span>
    );
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const eventDate = new Date(event.date);
    // Add timezone offset to prevent date from showing as previous day
    eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
    const formattedDate = eventDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Link 
            to={`/events/${event.id}`} 
            className="block bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group flex flex-col"
        >
            <div className="relative">
                <img 
                    src={event.image} 
                    alt={`Poster event ${event.title}`} 
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <CategoryBadge category={event.category} />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
                    <CalendarIcon className="w-4 h-4 mr-2 text-primary-500" />
                    <span>{formattedDate}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">{event.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">{event.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                    <span className="text-sm font-semibold text-primary-600 group-hover:underline">
                        Lihat Detail →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
