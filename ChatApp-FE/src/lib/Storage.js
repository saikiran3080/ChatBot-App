// src/lib/storage.js
// Simple per-user session persistence using localStorage.
// Exports: loadSessionsForUser(userKey), saveSessionsForUser(userKey, sessions)

const PREFIX = "chatapp_sessions_v1:";

export function _userKeyToStorageKey(userKey) {
  if (!userKey) return null;
  return `${PREFIX}${userKey}`;
}

/**
 * Load sessions for a user.
 * Returns an array (possibly empty).
 */
export function loadSessionsForUser(userKey) {
  try {
    const storageKey = _userKeyToStorageKey(userKey);
    if (!storageKey) return [];
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Defensive: ensure array
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error("loadSessionsForUser error", err);
    return [];
  }
}

/**
 * Save sessions for a user.
 * `sessions` should be serializable to JSON.
 */
export function saveSessionsForUser(userKey, sessions) {
  try {
    if (!userKey) return;
    const storageKey = _userKeyToStorageKey(userKey);
    localStorage.setItem(storageKey, JSON.stringify(sessions || []));
  } catch (err) {
    console.error("saveSessionsForUser error", err);
  }
}

/**
 * Optional: remove sessions for a user (logout cleanup)
 */
export function removeSessionsForUser(userKey) {
  try {
    if (!userKey) return;
    const storageKey = _userKeyToStorageKey(userKey);
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.error("removeSessionsForUser error", err);
  }
}
