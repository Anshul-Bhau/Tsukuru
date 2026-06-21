import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
// import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* Everything inside this block gets the Navbar and Footer automatically! */}
        <Route element={<Layout />}>
            <Route path="/landing" element={<LandingPage />} />
            {/* <Route path="/home" element={<HomePage />} /> */}
        </Route>

        {/* Example: A login page OUTSIDE the Layout block won't have a Navbar/Footer */}
        {/* <Route path="/login" element={<Login />} /> */}
        
        <Route path="/" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
}