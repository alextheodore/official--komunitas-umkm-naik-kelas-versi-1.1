
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/Breadcrumbs';
import { MenuIcon } from '../../components/icons';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Mobile Header */}
                <header className="flex justify-between items-center py-3 px-6 bg-white border-b border-gray-200 md:hidden">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="text-gray-500 focus:outline-none hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <span className="ml-4 text-lg font-bold text-gray-800">Admin Panel</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Breadcrumbs />
                    <div className="container mx-auto px-4 sm:px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
