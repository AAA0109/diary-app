import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// hooks
import LoginPage from 'pages/Auth/LoginPage';
import { PATH_AUTH, PATH_MAIN } from 'routes/paths';
import useAuth from '../hooks/useAuth';
// pages

// ----------------------------------------------------------------------

export interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, user } = useAuth();
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState('');

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        window.location.href = PATH_AUTH.login;
        return <></>
    }

    if (user?.onboarding && pathname.indexOf(PATH_MAIN.onboarding) < 0) {
        return <Navigate to={PATH_MAIN.onboarding} />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation('');
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
}
