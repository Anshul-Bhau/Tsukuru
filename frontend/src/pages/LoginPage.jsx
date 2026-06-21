import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(signupName, signupEmail, signupPassword);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("login");
            setError("");
          }}
        >
          Login
        </div>
        <div
          className={`tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("signup");
            setError("");
          }}
        >
          Sign Up
        </div>
      </div>

      <div className="form-container">
        {activeTab === "login" && (
          <form className="form active" onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="login-email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="login-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form className="form active" onSubmit={handleSignup}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="signup-name"
                placeholder="Enter your name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="signup-email"
                placeholder="Enter your email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="signup-password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
