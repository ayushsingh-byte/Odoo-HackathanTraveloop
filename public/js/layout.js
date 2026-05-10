const _origCheckAuth = checkAuth;

checkAuth = async function() {
  const user = await _origCheckAuth();
  if (user) _injectSidebar(user);
  return user;
};

setNavUser = function() {};

function _injectSidebar(user) {
  if (document.getElementById('__sidebar')) return;

  const page = document.body.dataset.page || '';

  const nav = [
    ['dashboard.html', '🏠', 'Dashboard', 'dashboard'],
    ['trips.html',     '🗺️', 'My Trips',  'trips'],
    ['trip-new.html',  '＋', 'New Trip',  'new-trip'],
    ['cities.html',    '🌍', 'Explore',   'cities'],
    ['community.html', '💬', 'Community', 'community'],
  ];

  const navHtml = nav.map(([href, icon, label, key]) =>
    `<li><a href="${href}"${key === page ? ' class="active"' : ''}><span class="sidebar-icon">${icon}</span>${label}</a></li>`
  ).join('');

  const adminHtml = user.role === 'admin'
    ? `<p class="sidebar-section">Admin</p>
       <ul class="sidebar-nav">
         <li><a href="admin.html"${page === 'admin' ? ' class="active"' : ''}><span class="sidebar-icon">⚙️</span>Admin Panel</a></li>
       </ul>`
    : '';

  const sidebar = document.createElement('aside');
  sidebar.id = '__sidebar';
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <a href="dashboard.html" class="sidebar-brand">✈ Traveloop</a>
    <p class="sidebar-section">Main</p>
    <ul class="sidebar-nav">${navHtml}</ul>
    ${adminHtml}
    <div class="sidebar-bottom">
      <a href="profile.html" class="sidebar-user" style="text-decoration:none">
        <div class="sidebar-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">${user.role}</div>
        </div>
      </a>
      <button onclick="_layoutLogout()" class="btn btn-ghost btn-sm w-full" style="justify-content:flex-start;padding:0.4rem 0.75rem;margin-top:0.4rem">⬅ Logout</button>
    </div>`;

  const inject = () => {
    document.body.prepend(sidebar);
    const mainEl = document.getElementById('__main');
    if (mainEl) mainEl.className = 'main-content';
    _injectTripSubnav(page);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
}

function _injectTripSubnav(page) {
  const wrap = document.getElementById('__trip-subnav');
  if (!wrap) return;
  const tripId = getParam('id');
  if (!tripId) return;

  const pages = [
    ['trip-view.html',      '📋', 'Itinerary', 'view'],
    ['trip-builder.html',   '🔨', 'Builder',   'builder'],
    ['trip-budget.html',    '💰', 'Budget',    'budget'],
    ['trip-checklist.html', '☑️',  'Checklist', 'checklist'],
    ['trip-notes.html',     '📝', 'Notes',     'notes'],
    ['trip-invoice.html',   '🧾', 'Invoice',   'invoice'],
  ];

  wrap.innerHTML = `<div class="trip-subnav">
    ${pages.map(([href, icon, label, key]) =>
      `<a href="${href}?id=${tripId}"${key === page ? ' class="active"' : ''}>
        <span class="trip-subnav-icon">${icon}</span><span>${label}</span>
      </a>`
    ).join('')}
  </div>`;
}

async function _layoutLogout() {
  await API.post('/api/auth/logout', {});
  window.location.href = 'index.html';
}
