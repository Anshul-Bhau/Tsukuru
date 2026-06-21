import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <div className="footer-inner-card">
                
                {/* Top Row: Brand & Socials */}
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2 className="logo-eng">Tsukuru</h2>
                        <span className="logo-jap">つくる</span>
                    </div>

                    <ul className="social-icons">
                        <li><a href="https://github.com/Anshul-Bhau/Tsukuru" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fa-brands fa-github"></i></a></li>
                        <li><a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a></li>
                        <li><a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
                    </ul>
                </div>

                {/* Bottom Row: Copyright & Legal */}
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