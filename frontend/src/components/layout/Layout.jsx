import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function Layout() {
    return (
        <div className="app-wrapper">
            <Navbar />
            
            <main className="main-content" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <Outlet /> 
            </main>

            <Footer />
        </div>
    );
}