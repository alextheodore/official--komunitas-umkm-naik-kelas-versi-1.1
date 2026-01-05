import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SpinnerIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    businessName: '',
    businessType: '',
    nib: '',
    consent: false,
  });
  
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name && 
      formData.email && 
      formData.password.length >= 6 && 
      formData.password === formData.confirmPassword &&
      formData.businessName &&
      formData.businessType &&
      formData.consent &&
      ktpFile
    );
  }, [formData, ktpFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Mengirimkan semua data UMKM sebagai metadata ke Supabase Auth
      // Data ini akan ditangkap oleh Database Trigger untuk dimasukkan ke tabel 'profiles'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            dob: formData.dob,
            gender: formData.gender,
            address: formData.address,
            business_name: formData.businessName,
            business_type: formData.businessType,
            nib: formData.nib
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Pendaftaran berhasil, arahkan ke login. 
        // Profil otomatis dibuat oleh trigger di database.
        navigate('/login', { state: { message: 'Pendaftaran berhasil! Silakan masuk.' } });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#0a1a3c]">Bergabung dengan Komunitas</h1>
          <p className="mt-2 text-gray-500 text-lg">Buat akun gratis Anda and mulai berkembang</p>
        </div>

        <div className="bg-white py-10 px-6 sm:px-12 rounded-xl shadow-sm border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
                  <option value="">Pilih...</option>
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required minLength={6} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea name="address" rows={2} value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Bisnis / Usaha</label>
                <input name="businessName" type="text" value={formData.businessName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Usaha</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
                  <option value="">Pilih...</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">NIB (Nomor Induk Berusaha) - Opsional</label>
                <input name="nib" type="text" value={formData.nib} onChange={handleChange} placeholder="Contoh: 1234567890" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Foto KTP</label>
                <input type="file" accept="image/*" onChange={(e) => setKtpFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" required />
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start">
                <input name="consent" type="checkbox" checked={formData.consent} onChange={handleChange} className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                <span className="ml-3 text-sm text-gray-500">
                  Dengan melanjutkan, Anda setuju dengan kebijakan privasi kami and siap memulai perjalanan sukses bersama Komunitas UMKM Naik Kelas.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-md text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">Sudah punya akun? <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">Masuk di sini</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;