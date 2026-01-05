import React from 'react';
import type { AppUser } from '../types';
import { LogoIcon } from './icons';

interface MemberCardProps {
    user: AppUser;
}

const MemberCard: React.FC<MemberCardProps> = ({ user }) => {
    // Generate a unique member number based on join date and user ID
    const joinYear = new Date(user.joinDate).getFullYear();
    const memberNumber = `UNK-${joinYear}-${user.id}`;

    // Format the join date
    const memberSince = new Date(user.joinDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    
    const handleDownload = () => {
        alert("Fitur download kartu sedang dalam pengembangan.");
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Kartu Anggota Digital</h3>
            <div className="flex flex-col items-center">
                {/* Card Element */}
                <div className="w-full max-w-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                     <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
                     <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-white/5 rounded-full"></div>
                    
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-bold">Komunitas UMKM Naik Kelas</h4>
                                <p className="text-xs text-primary-200">Kartu Anggota Digital</p>
                            </div>
                            <LogoIcon className="h-10 w-10 text-white" />
                        </div>

                        {/* Member Info */}
                        <div className="mt-8 flex items-center space-x-6">
                            <img 
                                src={user.profilePicture} 
                                alt={user.name}
                                className="h-24 w-24 rounded-full object-cover border-4 border-white/50"
                            />
                            <div>
                                <p className="text-2xl font-bold tracking-wide">{user.name}</p>
                                <p className="text-primary-100">{user.businessName}</p>
                            </div>
                        </div>

                        {/* Member Number and Date */}
                        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-xs text-primary-200 uppercase">Nomor Anggota</p>
                                <p className="text-lg font-semibold tracking-wider">{memberNumber}</p>
                            </div>
                             <div>
                                <p className="text-xs text-primary-200 uppercase">Anggota Sejak</p>
                                <p className="text-lg font-semibold">{memberSince}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button 
                    onClick={handleDownload}
                    className="mt-8 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Download Kartu
                </button>
            </div>
        </div>
    );
};

export default MemberCard;