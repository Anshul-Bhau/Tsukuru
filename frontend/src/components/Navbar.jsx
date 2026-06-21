import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import defaultPfp from '../assets/images/pfp/default-pfp.jpg';
import '../assets/css/Navbar.css';

export default function Navbar() {
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get('user/me/');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <header className="minimal-navbar">

            <div className="nav-left">
                <Link to="/landing" className="logo-pill">
                    TSUKURU
                </Link>
            </div>


            <div className="nav-right">
                <ul className="nav-links">
                    <li className={location.pathname === '/landing' ? 'active' : ''}>
                        <Link to="/landing">HOMEPAGE</Link>
                    </li>
                    <li className={location.pathname === '/home' ? 'active' : ''}>
                        <Link to="/home">COOK</Link>
                    </li>
                    <li className={location.pathname === '/guide' ? 'active' : ''}>
                        <a href="https://github.com/Anshul-Bhau/Tsukuru" target="_blank" rel="noreferrer">GUIDE</a>
                    </li>
                </ul>


                <div className="profile-container">
                    {!isLoading && user ? (
                        <Link to="/user_account" className="profile-circle filled">
                            <img
                                src={user.profile_picture || defaultPfp}
                                alt={user.username}
                            />
                        </Link>
                    ) : (
                        <Link to="/login" className="profile-circle empty" title="Login">
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}