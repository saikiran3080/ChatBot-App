// src/components/AuthModal.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const { signup, login } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const res = signup({ username, password, displayName });
      setLoading(false);
      if (res.ok) {
        onClose?.();
      } else {
        setError(res.message || "Signup failed");
      }
    } else {
      const res = login({ username, password });
      setLoading(false);
      if (res.ok) {
        onClose?.();
      } else {
        setError(res.message || "Login failed");
      }
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <div className="auth-header">
          <h3>{mode === "signup" ? "Create account" : "Sign in"}</h3>
          <button className="close-modal" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="field">
              <div className="label">Display name</div>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name (optional)"
              />
            </label>
          )}

          <label className="field">
            <div className="label">Username (email or name)</div>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
          </label>

          <label className="field">
            <div className="label">Password</div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup"
                ? "Have an account? Login"
                : "Create an account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
