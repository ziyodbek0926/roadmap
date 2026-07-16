const TOKEN_KEY = "edutech_access_token";
const AUTH_EVENT = "edutech-auth-changed";

export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

/**
 * useSyncExternalStore subscription for auth state. Listens for both our
 * own same-tab AUTH_EVENT (native "storage" events only fire in *other*
 * tabs) and cross-tab "storage" events, so every tab stays in sync.
 */
export function subscribeToAuthToken(callback: () => void): () => void {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
