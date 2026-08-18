const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "qv_token";
const EMAIL_KEY = "qv_email";

export interface AuthResult {
  token: string;
  email: string;
}

async function authRequest(path: string, email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? String(detail.detail) : `Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const token = await authRequest("/auth/login", email, password);
  return { token, email };
}

export async function register(email: string, password: string): Promise<AuthResult> {
  const token = await authRequest("/auth/register", email, password);
  return { token, email };
}

export function saveAuth(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getStoredAuth(): { token: string; email: string } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!token || !email) return null;
  return { token, email };
}