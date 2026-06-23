import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import defaultPfp from '../assets/images/pfp/default-pfp.jpg';
import { ChevronDown, Check } from 'lucide-react';
import '../assets/css/Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const [localPfp, setLocalPfp] = useState(localStorage.getItem('tsukuru_local_pfp'));

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get('auth/me/');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const handlePfpChange = () => {
            setLocalPfp(localStorage.getItem('tsukuru_local_pfp'));
        };

        window.addEventListener('pfpChanged', handlePfpChange);
        return () => window.removeEventListener('pfpChanged', handlePfpChange);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tsukuru_local_pfp'); 
        setUser(null);
        setLocalPfp(null);
        setShowDropdown(false);
        navigate('/landing');
        window.location.reload(); 
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
        navigate('/user_account');
    };

    const displayPfp = localPfp || user?.profile_picture || defaultPfp;

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

                <div className="profile-container" ref={dropdownRef}>
                    {isLoading ? (
                        <div className="profile-circle placeholder"></div>
                    ) : user ? (
                        <div className="profile-trigger-wrapper">
                            <button 
                                className="profile-circle filled" 
                                onClick={() => setShowDropdown(!showDropdown)}
                                aria-label="Toggle user menu"
                            >
                                {/* 4. UPDATED to use displayPfp */}
                                <img src={displayPfp} alt={user.username || "Profile"} />
                            </button>
                            <button 
                                className="nav-dropdown-chevron" 
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <ChevronDown size={14} />
                            </button>

                            {/* Floating Dropdown Modal */}
                            {showDropdown && (
                                <div className="pinterest-dropdown">
                                    <div className="dropdown-section">
                                        <span className="dropdown-label">Currently in</span>
                                        <div className="dropdown-profile-card" onClick={handleProfileClick}>
                                            {/* 5. UPDATED to use displayPfp */}
                                            <img 
                                                src={displayPfp} 
                                                alt={user.username} 
                                                className="dropdown-avatar"
                                            />
                                            <div className="dropdown-user-info">
                                                <span className="dropdown-name">{user.username || 'User'}</span>
                                                <span className="dropdown-subtitle">Personal</span>
                                                <span className="dropdown-email">{user.email || ''}</span>
                                            </div>
                                            <Check className="dropdown-check-icon" size={16} />
                                        </div>
                                    </div>

                                    <div className="dropdown-section">
                                        <button className="dropdown-text-btn">Convert to business</button>
                                    </div>

                                    <div className="dropdown-section">
                                        <span className="dropdown-label">Your accounts</span>
                                        <button className="dropdown-text-btn">Add account</button>
                                        <button className="dropdown-text-btn logout-btn" onClick={handleLogout}>
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/signup" className="nav-signup-btn">
                            Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}