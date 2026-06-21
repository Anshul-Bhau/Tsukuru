import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import images from assets folder
import profRudra from '../assets/images/prof_rudra.jpeg';
import profAnshul from '../assets/images/prof_anshul.jpg';
import profShashwat from '../assets/images/prof_shashwat.jpg';

import '../assets/css/contact.css';

export default function Contact({ user }) {
    return (
        <>
            <Navbar user={user} />
            
            <section className="contact_cont">
                <div className="sec_heading">Our Team</div>
                
                <div className="contact">
                    <div className="col">
                        <div className="card">
                            <img src={profRudra} alt="Rudra Singh Bhau" />
                            <h3>Rudra Singh Bhau</h3>
                            <p>Frontend Developer</p>
                        </div>
                        <div className="info">
                            <p><i className="fa-solid fa-location-dot"></i> Jaipur, India</p>
                            <p><i className="fa-brands fa-github"></i> <a href="https://github.com/rudee-Sb" target="_blank" rel="noreferrer">github.com/rudee-Sb</a></p>
                            <p><i className="fa-solid fa-envelope"></i> rudrabhau844@email.com</p>
                        </div>
                    </div>
                    
                    <div className="col">
                        <div className="card">
                            <img src={profAnshul} alt="Anshul Bhau" />
                            <h3>Anshul Bhau</h3>
                            <p>Backend Developer</p>
                        </div>
                        <div className="info">
                            <p><i className="fa-solid fa-location-dot"></i> Jaipur, India</p>
                            <p><i className="fa-brands fa-github"></i> <a href="https://github.com/Anshul-Bhau" target="_blank" rel="noreferrer">github.com/Anshul-Bhau</a></p>
                            <p><i className="fa-solid fa-envelope"></i> anshulbhau1@email.com</p>
                        </div>
                    </div>
                    
                    <div className="col">
                        <div className="card">
                            <img src={profShashwat} alt="Shashwat Baheti" />
                            <h3>Shashwat Baheti</h3>
                            <p>Frontend Developer</p>
                        </div>
                        <div className="info">
                            <p><i className="fa-solid fa-location-dot"></i> Jaipur, India</p>
                            <p><i className="fa-brands fa-github"></i> <a href="https://github.com/shashwat0224" target="_blank" rel="noreferrer">github.com/shashwat0224</a></p>
                            <p><i className="fa-solid fa-envelope"></i> shashwat24baheti@email.com</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}