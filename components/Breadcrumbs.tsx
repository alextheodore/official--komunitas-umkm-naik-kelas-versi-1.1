
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon } from './icons';

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
              
            // Deteksi ID (UUID atau string acak panjang)
            const isPotentialId = value.length > 20 || (index > 0 && ['marketplace', 'events', 'blog', 'forum'].includes(pathnames[index-1]));
            
            if (isPotentialId) {
                const parent = pathnames[index - 1];
                if (parent === 'marketplace') displayName = 'Detail Produk';
                else if (parent === 'events') displayName = 'Detail Event';
                else if (parent === 'blog') displayName = 'Detail Artikel';
                else if (parent === 'forum') displayName = 'Diskusi';
                else displayName = 'Detail';
            }

            const isMarketplaceSegment = value === 'marketplace';
            const showCategoryCrumb = isMarketplaceSegment && categoryFilter && categoryFilter !== 'Semua';
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
