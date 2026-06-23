import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // Check if the user has a valid token
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        // Kick unauthorized users directly to the login page
        return <Navigate to="/login" replace />;
    }

    // If authorized, render the requested protected page
    return <Outlet />;
}