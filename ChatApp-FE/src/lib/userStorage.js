// src/lib/userStorage.js
// Simple localStorage-backed user management for demo purposes.
// Not secure for production (passwords stored via simple base64); replace with server-side auth for production.

const USERS_KEY = "chatapp_users_v1";
const CURRENT_KEY = "chatapp_current_user_v1";

// helpers
function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  const arr = safeParse(raw);
  return Array.isArray(arr) ? arr : [];
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users || []));
  } catch (e) {
    console.error("saveUsers:", e);
  }
}

export function setCurrentUserId(id) {
  try {
    if (!id) localStorage.removeItem(CURRENT_KEY);
    else localStorage.setItem(CURRENT_KEY, id);
  } catch (e) {
    console.error("setCurrentUserId:", e);
  }
}

export function getCurrentUserId() {
  try {
    return localStorage.getItem(CURRENT_KEY) || null;
  } catch (e) {
    console.error("getCurrentUserId:", e);
    return null;
  }
}

export function clearCurrentUserId() {
  try {
    localStorage.removeItem(CURRENT_KEY);
  } catch (e) {
    console.error("clearCurrentUserId:", e);
  }
}

// Convenience: create user (returns created user or null if username exists)
export function createUser({ username, password, displayName }) {
  if (!username || !password) return null;
  const users = loadUsers();
  const exists = users.some((u) => u.username === username.toLowerCase());
  if (exists) return null;
  const id = crypto?.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(36).slice(2, 8);
  // store password in base64 for demo only (not secure)
  const pw = btoa(password);
  const user = {
    id,
    username: username.toLowerCase(),
    displayName: displayName || username,
    password: pw,
  };
  users.push(user);
  saveUsers(users);
  return user;
}

// Convenience: find user by credentials
export function findUserByCredentials({ username, password }) {
  if (!username || !password) return null;
  const users = loadUsers();
  const pw = btoa(password);
  const u = users.find(
    (x) => x.username === username.toLowerCase() && x.password === pw
  );
  return u || null;
}
