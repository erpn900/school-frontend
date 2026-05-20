// ============================================================
// utils.js  –  Shared UI helpers
// ============================================================

// ── Toast ──────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
}

// ── Modal ──────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function buildModal(id, title, formHtml, onSubmit) {
  let modal = document.getElementById(id);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button onclick="closeModal('${id}')" class="btn-icon">✕</button>
      </div>
      <div class="modal-body">
        <form id="${id}-form">${formHtml}</form>
      </div>
      <div class="modal-footer">
        <button type="button" onclick="closeModal('${id}')" class="btn btn-ghost">Cancel</button>
        <button type="submit" form="${id}-form" class="btn btn-primary">Save</button>
      </div>
    </div>`;
  document.getElementById(id + '-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    try {
      await onSubmit(data);
      closeModal(id);
    } catch (err) {
      toast(err.message, 'error');
    }
  });
  return modal;
}

// ── Data Table ─────────────────────────────────────────────
function renderTable({ containerId, columns, rows, onEdit, onDelete }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!rows || rows.length === 0) {
    container.innerHTML = '<p class="empty-state">No records found.</p>';
    return;
  }

  const thead = columns.map(c => `<th>${c.label}</th>`).join('') +
    (onEdit || onDelete ? '<th>Actions</th>' : '');

  const tbody = rows.map(row => {
    const cells = columns.map(c => {
      const val = c.render ? c.render(row) : (row[c.key] ?? '—');
      return `<td>${val}</td>`;
    }).join('');
    const actions = [];
    if (onEdit)   actions.push(`<button class="btn-icon" onclick='editRow(${JSON.stringify(row)})'>✏️</button>`);
    if (onDelete) actions.push(`<button class="btn-icon btn-danger" onclick="deleteRow('${row.id}')">🗑️</button>`);
    const actionCell = actions.length ? `<td class="action-cell">${actions.join('')}</td>` : '';
    return `<tr>${cells}${actionCell}</tr>`;
  }).join('');

  container.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`;
}

// ── Pagination ─────────────────────────────────────────────
function renderPagination({ containerId, page, totalPages, onPage }) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  const prev = page > 1
    ? `<button class="btn btn-ghost" onclick="(${onPage})(${page - 1})">← Prev</button>` : '';
  const next = page < totalPages
    ? `<button class="btn btn-ghost" onclick="(${onPage})(${page + 1})">Next →</button>` : '';

  container.innerHTML = `
    <div class="pagination">
      ${prev}
      <span>Page ${page} of ${totalPages}</span>
      ${next}
    </div>`;
}

// ── Search Debounce ────────────────────────────────────────
function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Date formatting ────────────────────────────────────────
function fmtDate(val) {
  if (!val) return '—';
  try { return new Date(val).toLocaleDateString(); } catch (_) { return val; }
}

function fmtDateTime(val) {
  if (!val) return '—';
  try { return new Date(val).toLocaleString(); } catch (_) { return val; }
}

// ── Guard ──────────────────────────────────────────────────
function requireAuth(allowedRoles) {
  if (!API.isLoggedIn()) { window.location.href = '../index.html'; return false; }
  const user = API.getUser();
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast('Access denied', 'error');
    window.location.href = '../index.html';
    return false;
  }
  return user;
}

function renderUserBadge(containerId) {
  const user = API.getUser();
  if (!user) return;
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <span class="role-badge role-${user.role}">${user.role}</span>
    <strong>${user.username}</strong>
    <button class="btn btn-ghost btn-sm" onclick="API.logout()">Logout</button>`;
}
