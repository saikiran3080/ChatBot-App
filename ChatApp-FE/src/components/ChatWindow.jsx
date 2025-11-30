import React, { useRef, useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import Composer from "./Composer";
import TypingIndicator from "./TypingIndicator";
import { streamChat } from "../lib/api";
import { getCurrentUserId, loadUsers } from "../lib/userStorage";

import "../styles/ChatWindow.css";

export default function ChatWindow({ session, onUpdate }) {
  const [messages, setMessages] = useState(session?.messages || []);
  const messagesRef = useRef(messages);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef(null);

  // Helper: keep state + ref + notify parent in sync
  const updateMessages = (newMessages) => {
    messagesRef.current = newMessages;
    setMessages(newMessages);
    try {
      onUpdate({ ...session, messages: newMessages });
    } catch (e) {
      // swallow: parent may not care
    }
  };

  // Add a single message (returns the updated array)
  const addMessage = (msg) => {
    const updated = [...messagesRef.current, msg];
    updateMessages(updated);
    return updated;
  };

  // Replace the last assistant message content (streaming)
  const replaceLastAssistant = (content) => {
    const prev = messagesRef.current || [];
    if (!prev.length) return;
    const updated = [...prev];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      content,
    };
    updateMessages(updated);
    return updated;
  };

  // When session changes (new chat selected), reset messages appropriately
  useEffect(() => {
    const sessMsgs = session?.messages || [];
    if (!sessMsgs || sessMsgs.length === 0) {
      const welcomeCard = {
        id: "welcome-card",
        role: "system",
        type: "card",
        createdAt: Date.now(),
        title: "👋 Welcome to ChatBot!",
        description:
          "Ask anything. I can help you with suggestions, information, and more!",
      };
      updateMessages([welcomeCard]);
    } else {
      // clone to avoid accidental mutation
      const sorted = [...sessMsgs].sort(
        (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
      );
      updateMessages(sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  // Send message (robust: uses messagesRef so stale state can't leak)
  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    // 1) user message
    const userMsg = { role: "user", content: text, createdAt: Date.now() };
    const afterUser = addMessage(userMsg);

    // 2) assistant placeholder
    const assistantMsg = {
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    const afterAssistant = addMessage(assistantMsg);

    setIsTyping(true);
    let acc = "";

    try {
      // IMPORTANT: pass the up-to-date array (afterAssistant)
      await streamChat(
        afterAssistant,
        (token) => {
          // incremental token callback
          acc += (acc === "" ? "" : " ") + token.trim();
          replaceLastAssistant(acc);
        },
        () => {
          setIsTyping(false);
        },
        (err) => {
          replaceLastAssistant("Error receiving response.");
          setIsTyping(false);
        }
      );
    } catch (err) {
      // stream start error
      replaceLastAssistant("Error starting stream.");
      setIsTyping(false);
    }
  };

  // auto-scroll on messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const id = getCurrentUserId();
    if (id) {
      const users = loadUsers();
      const user = users.find((u) => u.id === id);
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="chatwindow-wrapper">
      <div className="chatwindow-messages">
        {messages.map((m) => (
          <MessageItem
            key={m.createdAt || m.id}
            message={m}
            userName={currentUser?.displayName}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      {isTyping && <TypingIndicator />}
      <div className="chatwindow-composer-dock">
        <div className="chatwindow-composer-container">
          <Composer onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
