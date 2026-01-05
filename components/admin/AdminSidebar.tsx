
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogoIcon, DashboardIcon, UsersIcon, ContentIcon, CogIcon, CloseIcon, ForumIcon } from '../icons';
import { useAuth } from '../../contexts/AuthContext';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();

    const navLinks = [
        { to: '/admin', text: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
        { to: '/admin/users', text: 'Manajemen Pengguna', icon: <UsersIcon className="h-5 w-5" /> },
        { to: '/admin/content', text: 'Kelola Berita & Event', icon: <ContentIcon className="h-5 w-5" /> },
        { to: '/admin/forum', text: 'Moderasi Forum', icon: <ForumIcon className="h-5 w-5" /> },
        { to: '/admin/settings', text: 'Pengaturan', icon: <CogIcon className="h-5 w-5" /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`} 
                onClick={onClose}
            ></div>

            <aside className={`fixed inset-y-0 left-0 z-30 w-64 flex-col bg-gray-800 text-gray-300 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700">
                    <Link to="/" className="flex items-center space-x-2">
                        <LogoIcon className="h-8 w-auto text-white" />
                        <span className="text-xl font-bold text-white tracking-tight">Admin Panel</span>
                    </Link>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white focus:outline-none">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-grow px-4 py-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    end={link.to === '/admin'}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                        isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    <span>{link.text}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                     <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors">
                        <img src={currentUser?.profilePicture} alt={currentUser?.name} className="h-8 w-8 rounded-full object-cover border border-gray-600"/>
                        <div>
                            <p className="text-sm font-semibold text-white truncate w-32">{currentUser?.name}</p>
                            <p className="text-xs text-gray-400">Lihat Profil Utama</p>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
