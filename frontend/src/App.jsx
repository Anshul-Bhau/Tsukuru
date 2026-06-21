import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";

function HomePlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Tsukuru</h1>
      <p>Logged in as {user?.username ?? "guest"}.</p>
      {user && <button onClick={logout}>Log out</button>}
      <p style={{ marginTop: "1rem", color: "#666" }}>
        (Home page comes in a later stage — this is just here so login has
        somewhere to redirect to.)
      </p>
    </div>
  );
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
