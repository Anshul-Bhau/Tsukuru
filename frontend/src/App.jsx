import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
// import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
        
          <Route path="/landing" element={<LandingPage />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
        </Route>

        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route path="/" element={<Navigate to="/landing" replace />} />
        
      </Routes>
    </Router>
  );
}