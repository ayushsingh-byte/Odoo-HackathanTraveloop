const BASE = '';

export const API = {
  async _fetch(url, options = {}) {
    const res = await fetch(BASE + url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (res.status === 401) {
      window.location.href = '/login';
      return;
    }
    return res.json();
  },
  get: (url) => API._fetch(url),
  post: (url, body) => API._fetch(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => API._fetch(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body) => API._fetch(url, { method: 'PATCH', body: JSON.stringify(body) }),
  del: (url) => API._fetch(url, { method: 'DELETE' }),
};

export function fmt(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtMoney(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
