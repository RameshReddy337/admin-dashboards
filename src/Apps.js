// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // change if you don't use cookies
    ...opts,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export async function sendOtp(identifier) {
  return request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  });
}

export async function verifyOtp(identifier, otp) {
  return request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp })
  });
}
