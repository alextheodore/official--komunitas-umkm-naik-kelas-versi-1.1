import React from 'react';
import type { Article } from '../types';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserCircleIcon, ChevronRightIcon } from './icons';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const articleDate = new Date(article.date);
    // Add timezone offset to prevent date from showing as previous day
    articleDate.setMinutes(articleDate.getMinutes() + articleDate.getTimezoneOffset());
    const formattedDate = articleDate.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Link 
            to={`/blog/${article.id}`} 
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
        >
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden flex-shrink-0">
                <img 
                    src={article.image} 
                    alt={article.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-white/95 text-primary-700 shadow-sm backdrop-blur-sm border border-gray-100">
                    {article.category}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Meta Info */}
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                    <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>{formattedDate}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center">
                        <UserCircleIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span className="truncate max-w-[100px]">{article.author}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {article.summary}
                </p>

                {/* Footer CTA */}
                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                            src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author}&background=random`} 
                            alt={article.author} 
                            className="h-8 w-8 rounded-full object-cover border border-gray-200 mr-3" 
                        />
                        <span className="text-xs font-medium text-gray-500">Oleh {article.author.split(' ')[0]}</span>
                    </div>
                    <span className="inline-flex items-center text-sm font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
                        Baca Selengkapnya
                        <ChevronRightIcon className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;