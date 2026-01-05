import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon, SpinnerIcon } from '../components/icons';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Harap masukkan alamat email yang valid.');
      return;
    }
    
    setLoading(true);
    // Simulate API call to send reset email
    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setLoading(false);
      navigate('/reset-password-confirmation');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <LogoIcon className="h-10 w-auto text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">Komunitas UMKM Naik Kelas</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Lupa Password Anda?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 transition-transform transform hover:scale-105"
              >
                {loading ? (
                    <>
                        <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Mengirim...
                    </>
                ) : (
                    'Kirim Tautan Reset'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                &larr; Kembali ke halaman Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;