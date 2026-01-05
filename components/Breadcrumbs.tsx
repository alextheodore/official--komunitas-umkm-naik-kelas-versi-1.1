
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon } from './icons';
import { allProductsData } from '../data/products';
import { allEventsData } from '../pages/EventsPage';
import { allArticlesData } from '../pages/BlogPage';
import { allForumThreads } from '../data/forum';

const pathMap: { [key: string]: string } = {
  login: 'Masuk',
  register: 'Daftar',
  profile: 'Profil',
  'forgot-password': 'Reset Password',
  'reset-password-confirmation': 'Konfirmasi',
  programs: 'Program',
  forum: 'Forum',
  marketplace: 'Marketplace',
  sellers: 'Penjual',
  events: 'Event',
  blog: 'Blog',
  contact: 'Kontak',
  'all-cards': 'Komponen',
  admin: 'Admin',
  users: 'Pengguna',
  content: 'Konten',
  settings: 'Pengaturan',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't render breadcrumbs on the homepage
  if (pathnames.length === 0) {
    return null;
  }

  const categoryFilter = searchParams.get('category');

  return (
    <div className="bg-gray-50 border-b border-gray-200 w-full backdrop-blur-sm bg-opacity-90">
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 overflow-x-auto no-scrollbar whitespace-nowrap">
          <li className="flex-shrink-0">
            <Link to="/" className="text-gray-400 hover:text-primary-600 transition-colors flex items-center">
               <span className="text-xs font-medium">Beranda</span>
            </Link>
          </li>
          
          {pathnames.map((value, index) => {
            const isLastPathname = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            
            let displayName = pathMap[value] || value.charAt(0).toUpperCase() + value.slice(1);
              
            // Handle Dynamic IDs lookup
            // FIX: Use string comparison as IDs are now strings
            const isPotentialId = !isNaN(Number(value)) || value.includes('-') || value.length > 5;
            if (isPotentialId) {
                const prevSegment = pathnames[index - 1];
                const id = value;
                
                if (prevSegment === 'marketplace') {
                    const product = allProductsData.find(p => p.id === id);
                    displayName = product ? product.name : 'Detail Produk';
                } else if (prevSegment === 'sellers') {
                    displayName = 'Detail Penjual';
                } else if (prevSegment === 'blog') {
                    const article = allArticlesData.find(a => a.id === id);
                    displayName = article ? article.title : 'Detail Artikel';
                } else if (prevSegment === 'forum') {
                    const thread = allForumThreads.find(t => t.id === id);
                    displayName = thread ? thread.title : 'Detail Diskusi';
                } else if (prevSegment === 'events') {
                    const event = allEventsData.find(e => e.id === id);
                    displayName = event ? event.title : 'Detail Event';
                }
            }

            const isMarketplaceSegment = value === 'marketplace';
            // Only show category crumb if it exists and is not 'Semua'
            const showCategoryCrumb = isMarketplaceSegment && categoryFilter && categoryFilter !== 'Semua';
            
            // If we inject a category crumb, this segment becomes a parent link, unless it's the very last segment anyway without query params
            const isCurrentSegmentLast = isLastPathname && !showCategoryCrumb;

            return (
              <React.Fragment key={to}>
                <li className="flex items-center text-gray-400">
                  <ChevronRightIcon className="h-3 w-3 mx-1 flex-shrink-0" />
                </li>
                
                <li className="flex items-center">
                  {isCurrentSegmentLast ? (
                    <span className="text-xs font-bold text-gray-800 max-w-[120px] sm:max-w-xs truncate block" aria-current="page">
                      {displayName}
                    </span>
                  ) : (
                    <Link to={to} className="text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors max-w-[100px] sm:max-w-xs truncate block">
                      {displayName}
                    </Link>
                  )}
                </li>

                {showCategoryCrumb && (
                     <>
                        <li className="flex items-center text-gray-400">
                            <ChevronRightIcon className="h-3 w-3 mx-1 flex-shrink-0" />
                        </li>
                        <li className="flex items-center">
                            {/* If we are at the end of path (listing page), this crumb is the active page text. */}
                            {isLastPathname ? (
                                 <span className="text-xs font-bold text-gray-800" aria-current="page">
                                    {categoryFilter}
                                 </span>
                            ) : (
                                <Link to={`/marketplace?category=${categoryFilter}`} className="text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors">
                                    {categoryFilter}
                                </Link>
                            )}
                        </li>
                     </>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
