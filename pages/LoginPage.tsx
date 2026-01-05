
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogoIcon, SpinnerIcon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data, error: loginError } = await login(email, password);

      if (loginError) throw loginError;

      if (data.user) {
        // Ambil profil langsung untuk menentukan role secepat mungkin sebelum redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile role:", profileError);
          // Default ke profile jika gagal ambil role
          navigate('/profile', { replace: true });
          return;
        }

        // Logika Redirection
        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // User biasa selalu diarahkan ke profil setelah login manual
          // Kecuali jika mereka sebelumnya mencoba mengakses halaman terproteksi tertentu
          const from = (location.state as any)?.from?.pathname || '/profile';
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Email atau password salah.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <LogoIcon className="h-10 w-auto text-primary-600" />
              <span className="text-2xl font-bold text-gray-800">UMKM Naik Kelas</span>
            </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Selamat Datang Kembali</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 rounded-lg sm:px-10 shadow-sm">
          {location.state?.message && (
             <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-100 font-medium">
                {location.state.message}
             </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:bg-gray-300"
            >
                {isSubmitting ? <SpinnerIcon className="animate-spin h-5 w-5 text-white" /> : 'Masuk ke Akun'}
            </button>
          </form>

          <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun? <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">Daftar di sini</Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
