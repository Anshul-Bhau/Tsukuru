import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <div className="footer-inner-card">
                
                <div className="footer-main">
                    <div className="footer-brand-section">
                        <div className="footer-brand">
                            <h2 className="logo-eng">Tsukuru</h2>
                            <span className="logo-jap">つくる</span>
                        </div>
                    </div>

                    <div className="footer-nav-section">
                        <div className="footer-column">
                            <h4>Discover</h4>
                            <ul>
                                <li><Link to="/home">All Recipes</Link></li>
                                <li><Link to="/home">Trending</Link></li>
                                <li><Link to="/home">Surprise Me</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-column">
                            <h4>Tsukuru</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/careers">Careers</Link></li>
                                <li><Link to="/app">The App</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Support</h4>
                            <ul>
                                <li><Link to="/faq">FAQ</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/guidelines">Community Guidelines</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">&copy; {currentYear} Tsukuru</p>
                    <ul className="legal-links">
                        <li><Link to="/privacy">Privacy</Link></li>
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/cookies">Cookies</Link></li>
                    </ul>
                </div>

            </div>
        </footer>
    );
}