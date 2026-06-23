import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authBgImg from '../assets/images/auth-bg.png';
import '../assets/css/AuthPage.css';
import { authService } from '../services/authService';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setIsLogin] = useState(location.pathname === '/login');

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
    }, [location.pathname]);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            let data;
            if (isLogin) {
                data = await authService.login(formData.email, formData.password);
            } else {
                data = await authService.signup(formData.name, formData.email, formData.password);
            }

            // Save token to localStorage (or context)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);

            navigate('/home');

        } catch (error) {
            const serverError = error.response?.data?.error ||
                error.response?.data?.detail ||
                'Authentication failed. Please try again.';

            const formattedError = typeof serverError === 'object'
                ? Object.values(serverError).flat().join(', ')
                : serverError;

            setErrorMsg(formattedError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Column: Form */}
            <div className="auth-form-section">
                <div className="auth-form-wrapper">
                    <h1 className="auth-logo">Tsukuru</h1>

                    <div className="auth-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                        <p>
                            {isLogin
                                ? 'Sign in with your email address and password.'
                                : 'Join us to discover and save your favorite recipes.'}
                        </p>
                    </div>

                    {errorMsg && <div className="auth-error">{errorMsg}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="johndoe@xyz.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {isLogin && (
                            <div className="auth-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>
                        )}

                        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="auth-image-section">
                <img src={authBgImg} alt="Fresh ingredients" loading="lazy" />
            </div>
        </div>
    );
}