const API = {
  async _fetch(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (res.status === 401) {
      window.location.href = '/index.html';
      return;
    }
    return res.json();
  },
  get(url)         { return this._fetch(url); },
  post(url, body)  { return this._fetch(url, { method: 'POST',   body: JSON.stringify(body) }); },
  put(url, body)   { return this._fetch(url, { method: 'PUT',    body: JSON.stringify(body) }); },
  patch(url, body) { return this._fetch(url, { method: 'PATCH',  body: JSON.stringify(body) }); },
  del(url)         { return this._fetch(url, { method: 'DELETE' }); }
};

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function fmt(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMoney(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function showAlert(msg, type = 'error') {
  const el = document.getElementById('alert');
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function spinner() {
  return '<div class="spinner"></div>';
}

async function checkAuth() {
  const data = await API.get('/api/auth/me');
  if (!data || data.error) {
    window.location.href = '/index.html';
    return null;
  }
  return data.user;
}

function setNavUser(user) {
  const el = document.getElementById('nav-user');
  if (el && user) el.textContent = user.name;
}
