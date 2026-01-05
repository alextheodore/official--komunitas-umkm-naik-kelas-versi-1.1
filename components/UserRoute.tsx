
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    if (!currentUser) {
        // Redirect ke login jika belum masuk
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Izinkan akses ke halaman profil baik untuk role 'user' maupun 'admin'
    // Jika di masa depan ada halaman khusus user yang dilarang untuk admin, tambahkan pengecekan spesifik di sini.
    return children;
};

export default UserRoute;
