import React, { useState } from 'react';
import { CheckCircleIcon, SpinnerIcon, CogIcon, UsersIcon, BellIcon, LockClosedIcon } from '../../components/icons';

// Toggle Switch Component Helper
const ToggleSwitch: React.FC<{ label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{label}</span>
            {description && <span className="text-xs text-gray-500 mt-1">{description}</span>}
        </div>
        <button
            type="button"
            className={`${checked ? 'bg-primary-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'membership' | 'notifications' | 'security'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Data State
    const [settings, setSettings] = useState({
        // General
        siteName: 'Komunitas UMKM Naik Kelas',
        siteDescription: 'Platform komunitas digital untuk memajukan UMKM Indonesia.',
        supportEmail: 'support@umkmnaikkelas.id',
        maintenanceMode: false,
        // Membership
        allowRegistration: true,
        emailVerification: true,
        autoApproveMembers: false,
        // Notifications
        emailNotifications: true,
        newMemberAlert: true,
        transactionAlert: true,
        // Security
        minPasswordLength: 8,
        twoFactorAuth: false,
        sessionTimeout: 30,
    });

    const handleChange = (key: keyof typeof settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setShowSuccess(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API Call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const tabs = [
        { id: 'general', label: 'Umum', icon: <CogIcon className="w-5 h-5" /> },
        { id: 'membership', label: 'Keanggotaan', icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notifikasi', icon: <BellIcon className="w-5 h-5" /> },
        { id: 'security', label: 'Keamanan', icon: <LockClosedIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
                <p className="text-gray-600 mt-1">Kelola konfigurasi sistem dan preferensi aplikasi.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs Header */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-gray-100 focus:z-10 transition-colors flex items-center justify-center gap-2 ${
                                    activeTab === tab.id
                                        ? 'text-primary-600 bg-white border-b-2 border-primary-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 space-y-6 min-h-[400px]">
                    
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Situs</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => handleChange('siteName', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Situs</label>
                                <textarea
                                    rows={3}
                                    value={settings.siteDescription}
                                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">Deskripsi ini akan muncul di meta tag untuk SEO.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Support</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <ToggleSwitch
                                    label="Mode Maintenance"
                                    description="Aktifkan mode perbaikan. Hanya admin yang bisa mengakses situs."
                                    checked={settings.maintenanceMode}
                                    onChange={(val) => handleChange('maintenanceMode', val)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Membership Settings */}
                    {activeTab === 'membership' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <ToggleSwitch
                                label="Izinkan Pendaftaran Baru"
                                description="Pengguna baru dapat mendaftar akun."
                                checked={settings.allowRegistration}
                                onChange={(val) => handleChange('allowRegistration', val)}
                            />
                            <div className="border-t border-gray-100" />
                            <ToggleSwitch
                                label="Wajib Verifikasi Email"
                                description="Pengguna harus memverifikasi email sebelum bisa login."
                                checked={settings.emailVerification}
                                onChange={(val) => handleChange('emailVerification', val)}
                            />
                            <div className="border-t border-gray-100" />
                            <ToggleSwitch
                                label="Auto-Approve Anggota"
                                description="Setujui pendaftaran anggota secara otomatis tanpa review admin."
                                checked={settings.autoApproveMembers}
                                onChange={(val) => handleChange('autoApproveMembers', val)}
                            />
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <ToggleSwitch
                                label="Email Notifikasi Sistem"
                                description="Kirim email notifikasi penting ke admin."
                                checked={settings.emailNotifications}
                                onChange={(val) => handleChange('emailNotifications', val)}
                            />
                            <div className="border-t border-gray-100" />
                            <ToggleSwitch
                                label="Alert Anggota Baru"
                                description="Beritahu admin setiap kali ada pendaftaran baru."
                                checked={settings.newMemberAlert}
                                onChange={(val) => handleChange('newMemberAlert', val)}
                            />
                            <div className="border-t border-gray-100" />
                            <ToggleSwitch
                                label="Alert Transaksi Marketplace"
                                description="Notifikasi untuk setiap transaksi penjualan."
                                checked={settings.transactionAlert}
                                onChange={(val) => handleChange('transactionAlert', val)}
                            />
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Panjang Password Minimum</label>
                                <input
                                    type="number"
                                    min="6"
                                    max="32"
                                    value={settings.minPasswordLength}
                                    onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
                                    className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Timeout Sesi (Menit)</label>
                                <input
                                    type="number"
                                    min="5"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                                    className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">Pengguna akan logout otomatis setelah durasi inaktif ini.</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <ToggleSwitch
                                    label="Wajib Autentikasi 2 Faktor (2FA)"
                                    description="Paksa semua admin untuk menggunakan 2FA."
                                    checked={settings.twoFactorAuth}
                                    onChange={(val) => handleChange('twoFactorAuth', val)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        {showSuccess && (
                            <span className="flex items-center text-green-600 animate-fade-in-up">
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                Pengaturan berhasil disimpan!
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isSaving ? (
                            <>
                                <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;