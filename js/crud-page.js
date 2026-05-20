// ============================================================
// crud-page.js  –  Generic CRUD page controller
// Each list page (students, teachers, etc.) calls initCrudPage()
// ============================================================

function initCrudPage({
  resource,       // e.g. 'students'
  apiList,        // e.g. API.getStudents
  apiCreate,      // e.g. API.createStudent
  apiUpdate,      // e.g. API.updateStudent
  apiDelete,      // e.g. API.deleteStudent
  columns,        // Array of { key, label, render? }
  formFields,     // Array of { name, label, type, required, options? }
  allowedRoles,   // e.g. ['admin']
  filterFields,   // optional: [{label, key, options}]
  searchKey,      // optional: field to search by (default 'name')
}) {
  const PAGE_SIZE = 10;
  let currentPage = 1;
  let editingRow  = null;
  let allFilters  = {};

  // ── Auth ──────────────────────────────────────────────────
  const user = requireAuth(allowedRoles);
  if (!user) return;
  initLayout(allowedRoles);

  // ── Build filter bar ──────────────────────────────────────
  if (filterFields && filterFields.length) {
    const bar = document.getElementById('filter-bar');
    if (bar) {
      bar.innerHTML = filterFields.map(f => `
        <select class="form-control" style="max-width:180px"
          onchange="window.__setFilter('${f.key}', this.value)">
          <option value="">All ${f.label}</option>
          ${(f.options || []).map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>`).join('');
    }
  }

  window.__setFilter = (key, value) => {
    allFilters[key] = value;
    currentPage = 1;
    loadData();
  };

  // ── Search ────────────────────────────────────────────────
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', debounce(() => {
      allFilters['filter_field'] = searchKey || 'name';
      allFilters['filter_value'] = searchEl.value;
      if (!searchEl.value) { delete allFilters['filter_field']; delete allFilters['filter_value']; }
      currentPage = 1;
      loadData();
    }, 400));
  }

  // ── Load data ─────────────────────────────────────────────
  async function loadData() {
    const tableEl = document.getElementById('data-table-container');
    const pagEl   = document.getElementById('pagination');
    tableEl.innerHTML = '<div class="loading">Loading…</div>';

    try {
      const res = await apiList({ page: currentPage, limit: PAGE_SIZE, ...allFilters });
      renderTable({
        containerId: 'data-table-container',
        columns,
        rows: res.data,
        onEdit:   apiUpdate ? row => openEdit(row) : null,
        onDelete: apiDelete ? id  => handleDelete(id) : null,
      });
      renderPagination({
        containerId: 'pagination',
        page: res.page,
        totalPages: res.totalPages,
        onPage: function(p) { currentPage = p; loadData(); },
      });
    } catch (err) {
      tableEl.innerHTML = `<p class="empty-state" style="color:var(--danger)">${err.message}</p>`;
    }
  }

  // ── Build form HTML ───────────────────────────────────────
  function buildFormHtml(data = {}) {
    const fields = formFields.map(f => {
      const val = data[f.name] || '';
      let input;
      if (f.type === 'select') {
        const opts = (f.options || []).map(o =>
          `<option value="${o.value}" ${val == o.value ? 'selected' : ''}>${o.label}</option>`
        ).join('');
        input = `<select name="${f.name}" class="form-control" ${f.required ? 'required' : ''}><option value="">Select…</option>${opts}</select>`;
      } else if (f.type === 'textarea') {
        input = `<textarea name="${f.name}" class="form-control" rows="3">${val}</textarea>`;
      } else {
        input = `<input type="${f.type || 'text'}" name="${f.name}" class="form-control" value="${val}" ${f.required ? 'required' : ''} placeholder="${f.placeholder || ''}">`;
      }
      const span = f.span2 ? ' span-2' : '';
      return `<div class="form-group${span}"><label>${f.label}${f.required ? ' *' : ''}</label>${input}</div>`;
    }).join('');

    return `<div class="form-grid">${fields}</div>`;
  }

  // ── Create modal ──────────────────────────────────────────
  const createBtn = document.getElementById('create-btn');
  if (createBtn && apiCreate) {
    createBtn.addEventListener('click', () => {
      editingRow = null;
      buildModal('record-modal', `Add ${resource.slice(0, -1)}`, buildFormHtml(), async data => {
        await apiCreate(data);
        toast('Created successfully!');
        loadData();
      });
      openModal('record-modal');
    });
  }

  // ── Edit ──────────────────────────────────────────────────
  window.editRow = function(row) {
    editingRow = row;
    buildModal('record-modal', `Edit ${resource.slice(0, -1)}`, buildFormHtml(row), async data => {
      await apiUpdate({ ...data, id: row.id });
      toast('Updated successfully!');
      loadData();
    });
    openModal('record-modal');
  };

  // ── Delete ────────────────────────────────────────────────
  window.deleteRow = async function(id) {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    try {
      await apiDelete(id);
      toast('Deleted successfully!');
      loadData();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  // ── Initial load ──────────────────────────────────────────
  loadData();
}
