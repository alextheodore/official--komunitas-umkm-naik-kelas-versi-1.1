
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, SearchIcon, DocumentTextIcon, CalendarIcon, SpinnerIcon } from './icons';
import type { Event, Article } from '../types';
import { supabase } from '../lib/supabase';

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
  if (!text) return null;
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
  
  if (startIndex > 0) snippet = '... ' + snippet;
  if (endIndex < text.length) snippet = snippet + ' ...';

  return <HighlightMatch text={snippet} query={query} />;
};


const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ events: Event[]; articles: Article[] }>({ events: [], articles: [] });
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ events: [], articles: [] });
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ events: [], articles: [] });
      setLoading(false);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const [eveRes, artRes] = await Promise.all([
          supabase.from('events').select('*').ilike('title', `%${query}%`).limit(5),
          supabase.from('articles').select('*').or(`title.ilike.%${query}%,summary.ilike.%${query}%`).limit(5)
        ]);

        setResults({
          events: eveRes.data || [],
          articles: artRes.data?.map((a: any) => ({ ...a, authorImage: a.author_image })) || []
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // Debounce search

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleResultClick = () => onClose();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-2 flex items-center border-b border-gray-100">
            <div className="pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              id="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari event, berita, atau panduan UMKM..."
              className="block w-full pl-4 pr-12 py-4 border-0 text-lg font-medium text-gray-900 placeholder-gray-400 focus:ring-0 outline-none"
            />
             <div className="absolute right-4 flex items-center gap-3">
              {loading && <SpinnerIcon className="h-5 w-5 text-primary-500 animate-spin" />}
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] bg-gray-50/30">
           {!loading && query.trim().length > 1 && results.events.length === 0 && results.articles.length === 0 && (
              <div className="text-center py-20 px-4 text-gray-500">
                <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <SearchIcon className="h-10 w-10 text-gray-300" />
                </div>
                <p className="font-bold text-gray-900">Hasil tidak ditemukan</p>
                <p className="text-sm">Tidak ada konten yang cocok dengan "{query}".</p>
              </div>
            )}

            {(results.events.length > 0 || results.articles.length > 0) && (
              <div className="p-4 space-y-6">
                {results.events.length > 0 && (
                  <section>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-3">Agenda & Event</h3>
                    <ul className="space-y-1">
                      {results.events.map(event => (
                        <li key={event.id}>
                          <Link to={`/events/${event.id}`} onClick={handleResultClick} className="flex items-start p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex-shrink-0 mt-1 h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                              <CalendarIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <p className="font-bold text-gray-900 group-hover:text-primary-600">
                                <HighlightMatch text={event.title} query={query} />
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 font-mono">
                                {new Date(event.date).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                
                {results.articles.length > 0 && (
                  <section>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-3">Wawasan Bisnis</h3>
                    <ul className="space-y-1">
                      {results.articles.map(article => (
                        <li key={article.id}>
                          <Link to={`/blog/${article.id}`} onClick={handleResultClick} className="flex items-start p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex-shrink-0 mt-1 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <p className="font-bold text-gray-900 group-hover:text-indigo-600">
                                <HighlightMatch text={article.title} query={query} />
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                <SnippetHighlight text={article.summary} query={query} />
                              </p>
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
        
        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 border-t border-gray-100 flex justify-between items-center">
            <span className="font-medium">Ketikan minimal 2 karakter untuk mencari...</span>
            <div className="flex gap-2">
                <span className="px-1.5 py-0.5 bg-white border border-gray-200 rounded shadow-sm">ESC</span>
                <span>untuk keluar</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
