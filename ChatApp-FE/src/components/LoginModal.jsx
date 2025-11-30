import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const { login, signup } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (isSignup) {
      signup(username, password);
      onClose();
    } else {
      const ok = login(username, password);
      if (ok) onClose();
      else alert("Invalid credentials");
    }
  }

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            required
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{ marginTop: "10px" }}
        >
          {isSignup ? "Have account? Login" : "Create new account"}
        </button>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
