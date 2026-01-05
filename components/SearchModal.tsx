import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, SearchIcon, DocumentTextIcon, CalendarIcon } from './icons';
import { allEventsData } from '../pages/EventsPage';
import { allArticlesData } from '../pages/BlogPage';
import type { Event, Article } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) {
    return <>{text}</>;
  }
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 font-semibold text-gray-800 rounded-sm">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const SnippetHighlight: React.FC<{ text: string; query: string; snippetLength?: number }> = ({ text, query, snippetLength = 120 }) => {
  if (!query) {
    return <>{text.length > snippetLength ? text.substring(0, snippetLength) + '...' : text}</>;
  }

  const lowerCaseText = text.toLowerCase();
  const lowerCaseQuery = query.toLowerCase();
  const matchIndex = lowerCaseText.indexOf(lowerCaseQuery);

  if (matchIndex === -1) {
    return <>{text.length > snippetLength ? text.substring(0, snippetLength) + '...' : text}</>;
  }
  
  const halfSnippet = Math.floor((snippetLength - query.length) / 2);
  let startIndex = Math.max(0, matchIndex - halfSnippet);
  let endIndex = Math.min(text.length, startIndex + snippetLength);

  if (startIndex > 0) {
    const spaceIndex = text.lastIndexOf(' ', startIndex);
    startIndex = spaceIndex !== -1 ? spaceIndex + 1 : 0;
  }
  
  if (endIndex < text.length) {
    const spaceIndex = text.indexOf(' ', endIndex);
    endIndex = spaceIndex !== -1 ? spaceIndex : text.length;
  }

  let snippet = text.substring(startIndex, endIndex);
  
  if (startIndex > 0) {
    snippet = '... ' + snippet;
  }
  if (endIndex < text.length) {
    snippet = snippet + ' ...';
  }

  return <HighlightMatch text={snippet} query={query} />;
};


const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ events: Event[]; articles: Article[] }>({ events: [], articles: [] });
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ events: [], articles: [] });
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredEvents = allEventsData.filter(event =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredArticles = allArticlesData.filter(article =>
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.summary.toLowerCase().includes(lowerCaseQuery)
    );

    setResults({ events: filteredEvents.slice(0, 5), articles: filteredArticles.slice(0, 5) });
  }, [query]);

  const handleResultClick = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-2">
            <label htmlFor="search-input" className="sr-only">Cari</label>
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="search"
              id="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari event, artikel, atau anggota..."
              className="block w-full pl-12 pr-12 py-3 border-0 rounded-md placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            />
             <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Tutup pencarian"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh] border-t border-gray-200">
           {query.trim().length > 1 && results.events.length === 0 && results.articles.length === 0 && (
              <div className="text-center py-10 px-4 text-gray-500">
                <p className="font-semibold">Tidak ada hasil ditemukan</p>
                <p className="text-sm">Coba gunakan kata kunci yang berbeda.</p>
              </div>
            )}

            {(results.events.length > 0 || results.articles.length > 0) && (
              <div className="p-4">
                {results.events.length > 0 && (
                  <section className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Event & Pelatihan</h3>
                    <ul>
                      {results.events.map(event => (
                        <li key={`event-${event.title}`}>
                          <Link to="/events" onClick={handleResultClick} className="block p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start">
                              <CalendarIcon className="h-6 w-6 mr-4 text-primary-500 flex-shrink-0 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  <HighlightMatch text={event.title} query={query} />
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  <SnippetHighlight text={event.description} query={query} />
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                
                {results.articles.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Berita & Artikel</h3>
                    <ul>
                      {results.articles.map(article => (
                        <li key={`article-${article.id}`}>
                          <Link to={`/blog/${article.id}`} onClick={handleResultClick} className="block p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start">
                              <DocumentTextIcon className="h-6 w-6 mr-4 text-primary-500 flex-shrink-0 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  <HighlightMatch text={article.title} query={query} />
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  <SnippetHighlight text={article.summary} query={query} />
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;