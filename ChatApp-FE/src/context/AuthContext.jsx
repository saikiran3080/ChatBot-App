// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadUsers,
  saveUsers,
  setCurrentUserId,
  getCurrentUserId,
  clearCurrentUserId,
  createUser,
  findUserByCredentials,
} from "../lib/userStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [authMessage, setAuthMessage] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const id = getCurrentUserId();
    if (!id) return null;
    const all = loadUsers();
    return all.find((u) => u.id === id) || null;
  });

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  function signup({ username, password, displayName }) {
    if (!username || !password)
      return { ok: false, message: "Missing username or password" };

    const u = createUser({ username, password, displayName });
    if (!u) return { ok: false, message: "Username already exists" };

    setUsers((prev) => [...prev, u]);
    setCurrentUser(u);
    setCurrentUserId(u.id);

    setAuthMessage("Successfully Signed Up");

    return { ok: true, user: u };
  }

  function login({ username, password }) {
    const found = findUserByCredentials({ username, password });
    if (!found) return { ok: false, message: "Invalid credentials" };

    setCurrentUser(found);
    setCurrentUserId(found.id);

    setAuthMessage("Successfully Logged In");

    return { ok: true, user: found };
  }

  function logout() {
    setCurrentUser(null);
    clearCurrentUserId();
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        signup,
        login,
        logout,
        authMessage,
        setAuthMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
