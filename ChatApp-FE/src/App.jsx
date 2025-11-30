import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { loadSessionsForUser, saveSessionsForUser } from "./lib/storage";
import { v4 as uuidv4 } from "uuid";
import "./styles/App.css";
import { useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

import SuccessToast from "./components/SuccessToast";
import LogoutConfirmModal from "./components/LogoutConfirmModal";

export default function App() {
  const { currentUser, logout, authMessage, setAuthMessage } = useAuth();
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  // Listen for logout event
  useEffect(() => {
    const handler = () => setShowLogoutModal(true);
    window.addEventListener("request_logout", handler);
    return () => window.removeEventListener("request_logout", handler);
  }, []);

  // Load sessions for logged-in user
  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setActiveSessionId(null);
      return;
    }

    const data = loadSessionsForUser(
      currentUser.id || currentUser.username || currentUser.email
    );

    if (data && data.length) {
      setSessions(data);
      setActiveSessionId(data[0].id);
    } else {
      const id = uuidv4();
      const initial = {
        id,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      };
      setSessions([initial]);
      setActiveSessionId(id);
    }
  }, [currentUser]);

  // Persist sessions when changed (per-user)
  useEffect(() => {
    if (!currentUser) return;
    const userKey = currentUser.id || currentUser.username || currentUser.email;
    saveSessionsForUser(userKey, sessions);
  }, [sessions, currentUser]);

  // theme persist
  useEffect(() => {
    try {
      localStorage.setItem("chat_theme", dark ? "dark" : "light");
    } catch {}
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  function createNewSession() {
    const id = uuidv4();
    const session = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((s) => [...s, session]);
    setActiveSessionId(id);
  }

  function updateSession(updatedSession) {
    /*
    setSessions((list) =>
      list.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
    */
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  }

  function deleteSession(id) {
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (!filtered.length) createNewSession();
    else if (activeSessionId === id) setActiveSessionId(filtered[0].id);
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className={`app-root ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="btn-icon sidebar-toggle"
            onClick={() => setSidebarCollapsed((v) => !v)}
          >
            {sidebarCollapsed ? "➡" : "☰"}
          </button>

          <div className="brand">
            <span className="brand-logo" aria-hidden>
              💬
            </span>
            <span className="brand-text">Chat-App</span>
          </div>
        </div>

        <div className="topbar-right">
          {currentUser ? (
            <button class="button-85" role="button">
              Welcome, {currentUser.displayName}
            </button>
          ) : null}
          <button
            className="btn-icon theme-toggle"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <div className="main-layout">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={(id) => setActiveSessionId(id)}
          onCreate={createNewSession}
          onDelete={deleteSession}
          collapsed={sidebarCollapsed}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        <main className="workspace">
          {activeSession ? (
            <ChatWindow session={activeSession} onUpdate={updateSession} />
          ) : (
            <div className="no-session-box">
              <p className="no-session-text">No session selected</p>
            </div>
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {authMessage && (
        <SuccessToast
          message={authMessage}
          onClose={() => setAuthMessage(null)}
        />
      )}

      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={() => {
            logout();
            setShowLogoutModal(false);
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
