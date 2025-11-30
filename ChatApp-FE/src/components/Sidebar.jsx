// src/components/Sidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
  collapsed = false,
  onOpenAuth,
}) {
  const { currentUser } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div
            className="logo-area"
            onClick={() => onSelect(sessions?.[0]?.id)}
          >
            <div className="logo-icon">💬</div>
            {!collapsed && <div className="logo-text">Chats</div>}
          </div>

          <div className="actions">
            <button className="user-btn" onClick={onCreate} title="New chat">
              {collapsed ? "➕" : "New"}
            </button>
          </div>
        </div>

        <div
          className="sidebar-list"
          role="navigation"
          aria-label="Chat sessions"
        >
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`session-item ${
                s.id === activeSessionId ? "active" : ""
              }`}
              role="button"
              tabIndex={0}
              title={collapsed ? s.title || "Untitled Chat" : undefined}
            >
              <div className="session-left">
                <div className="session-icon">💭</div>
              </div>

              {!collapsed && (
                <div className="session-main">
                  <div className="session-title">
                    {s.title || "Untitled Chat"}
                  </div>
                  <div className="session-meta">
                    {s.messages?.length
                      ? `${s.messages.length} message${
                          s.messages.length > 1 ? "s" : ""
                        }`
                      : "No messages"}
                  </div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                title="Delete chat"
                className="btn-icon-delete"
                aria-label={`Delete chat: ${s.title || "Untitled"}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="sidebar-footer">
          <div className="footer-left">
            <button
              className="user-btn"
              title="User menu"
              onClick={() => {
                if (!currentUser) return onOpenAuth?.();
                window.dispatchEvent(new CustomEvent("request_logout"));
              }}
            >
              {collapsed ? "👤" : currentUser ? `Logout ` : "Login"}
            </button>
          </div>

          <div className="footer-right">
            {/* <button className="theme-btn" title="Toggle theme">
              🌗
            </button> */}
          </div>
        </div>
      </div>
    </aside>
  );
}
