// MessageItem.jsx
import React from "react";
import "../styles/MessageItem.css";

export default function MessageItem({ message: m, userName = "" }) {
  const isUser = m.role === "user";

  // ---- Generate User Initials ----
  const getInitials = () => {
    if (isUser === "user" && userName) {
      const parts = userName.trim().split(" ");
      const initials = parts
        .map((p) => p[0])
        .join("")
        .toUpperCase();
      return initials || "U";
    }
    if (isUser === "bot") return "AI";
    return "U";
  };

  const userInitials = getInitials(userName);

  // ---- CARD UI SUPPORT ----
  if (m.type === "card") {
    return (
      <div className="welcome-card">
        <h2 className="welcome-card-title">{m.title}</h2>
        <p className="welcome-card-desc">{m.description}</p>
      </div>
    );
  }
  // --------------------------

  const text =
    m.content && m.content.length ? m.content : m.streaming ? "..." : "";

  const createdAt = m.createdAt || Date.now();

  return (
    <div className={isUser ? "msg-row-user" : "msg-row-bot"}>
      {!isUser && <div className="msg-avatar bot-avatar">AI</div>}
      <div
        className={isUser ? "msg-bubble user-bubble" : "msg-bubble bot-bubble"}
      >
        <div className="msg-text">{text}</div>
        <div className="msg-time">
          {new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* RIGHT SIDE AVATAR */}
      {isUser && <div className="msg-avatar user-avatar">{userInitials}</div>}
    </div>
  );
}
