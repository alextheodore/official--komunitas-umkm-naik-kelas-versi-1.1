
import React, { useRef, useState } from 'react';
import type { AppUser } from '../types';
import { LogoIcon, SpinnerIcon } from './icons';

interface MemberCardProps {
    user: AppUser;
}

const MemberCard: React.FC<MemberCardProps> = ({ user }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Generate nomor anggota unik
    const joinYear = new Date(user.joinDate).getFullYear();
    const memberNumber = `UNK-${joinYear}-${user.id.substring(0, 5).toUpperCase()}`;

    const memberSince = new Date(user.joinDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    
    /**
     * Menggambar kartu anggota ke canvas dan mengunduhnya sebagai PNG
     */
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set dimensi HD untuk kartu (1000px x 630px)
            canvas.width = 1000;
            canvas.height = 630;

            // 1. Gambar Background Gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0062CC'); // Primary-600
            gradient.addColorStop(1, '#003166'); // Primary-800
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Gambar Elemen Dekorasi (Lingkaran)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.arc(canvas.width, 0, 300, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, canvas.height, 250, 0, Math.PI * 2);
            ctx.fill();

            // 3. Header Teks
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText('Komunitas UMKM Naik Kelas', 60, 80);
            
            ctx.fillStyle = '#CCE5FF'; // Primary-100
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('KARTU ANGGOTA DIGITAL', 60, 115);

            // 4. Garis Pemisah
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(60, 150);
            ctx.lineTo(canvas.width - 60, 150);
            ctx.stroke();

            // 5. Muat dan Gambar Foto Profil (Lingkaran)
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Krusial untuk menghindari error CORS
            
            // Tunggu gambar profil termuat
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = user.profilePicture;
            });

            // Kliping Lingkaran untuk Foto
            ctx.save();
            ctx.beginPath();
            const photoX = 160;
            const photoY = 320;
            const photoR = 100;
            ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);
            ctx.restore();

            // Border putih di sekeliling foto
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
            ctx.stroke();

            // 6. Nama Anggota & Bisnis
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px sans-serif';
            ctx.fillText(user.name.toUpperCase(), 300, 310);
            
            ctx.fillStyle = '#FFC107'; // Accent Color
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText(user.businessName, 300, 360);

            // 7. Footer Info (Nomor & Tanggal)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('NOMOR ANGGOTA', 60, 520);
            ctx.fillText('ANGGOTA SEJAK', canvas.width / 2, 520);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 28px monospace';
            ctx.fillText(memberNumber, 60, 565);
            
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText(memberSince, canvas.width / 2, 565);

            // 8. Tanda Tangan Digital / Watermark logo kecil di pojok
            ctx.globalAlpha = 0.3;
            ctx.font = 'italic 14px sans-serif';
            ctx.fillText('umkmnaikkelas.id', canvas.width - 180, canvas.height - 40);
            ctx.globalAlpha = 1.0;

            // 9. Konversi ke Blob dan Download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `Kartu_Anggota_${user.name.replace(/\s+/g, '_')}.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');

        } catch (err) {
            console.error("Gagal generate kartu:", err);
            alert("Maaf, gagal mengunduh kartu. Pastikan koneksi internet Anda stabil.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black text-gray-800">Kartu Anggota Digital</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Identitas Komunitas Resmi</p>
                </div>
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-black text-sm rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isDownloading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : null}
                    {isDownloading ? 'MENYIAPKAN FILE...' : 'DOWNLOAD KARTU (PNG)'}
                </button>
            </div>

            <div className="flex flex-col items-center">
                {/* Visual Preview Card (CSS Only) */}
                <div 
                    ref={cardRef}
                    className="w-full max-w-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-[2rem] shadow-2xl p-8 md:p-10 relative overflow-hidden aspect-[1.6/1] border border-white/10"
                >
                     <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg md:text-xl font-black tracking-tight leading-none">UMKM Naik Kelas</h4>
                                <p className="text-[10px] font-bold text-primary-200 mt-1 uppercase tracking-[0.2em]">Official Digital Member</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <LogoIcon className="h-12 w-12 text-white" />
                            </div>
                        </div>

                        {/* Member Info */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img 
                                    src={user.profilePicture} 
                                    alt={user.name}
                                    className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-white/30 shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-accent text-gray-900 rounded-full p-1 border-2 border-primary-700 shadow-md">
                                     <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl md:text-2xl font-black tracking-tight truncate leading-tight uppercase">{user.name}</p>
                                <p className="text-accent font-bold text-sm md:text-base tracking-wide truncate">{user.businessName}</p>
                            </div>
                        </div>

                        {/* Member Number and Date */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[9px] font-black text-primary-200 uppercase tracking-widest">Nomor Anggota</p>
                                <p className="text-xs md:text-base font-black tracking-[0.15em] font-mono text-white/90">{memberNumber}</p>
                            </div>
                             <div>
                                <p className="text-[9px] font-black text-primary-200 uppercase tracking-widest">Bergabung Sejak</p>
                                <p className="text-xs md:text-base font-black text-white/90">{memberSince}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3 max-w-lg">
                    <div className="bg-primary-100 p-1 rounded">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Gunakan kartu ini sebagai tanda pengenal resmi untuk mendapatkan benefit diskon dari mitra komunitas dan akses prioritas di setiap event pameran kami.</p>
                </div>
            </div>
        </div>
    );
};

export default MemberCard;
