import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (currentUser.role !== 'admin') {
        // If the user is logged in but is not an admin, redirect to homepage
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
