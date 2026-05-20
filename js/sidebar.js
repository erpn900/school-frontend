<!-- sidebar.html – included via JS into every dashboard page -->
<!-- Usage: document.getElementById('sidebar').innerHTML = buildSidebar(role); -->
<script>
function buildSidebar(role) {
  const allLinks = {
    admin: [
      { section: 'Overview',   links: [
        { href: 'admin-dashboard.html',  icon: '🏠', label: 'Dashboard' },
      ]},
      { section: 'People', links: [
        { href: 'students.html',  icon: '🎒', label: 'Students' },
        { href: 'teachers.html',  icon: '👩‍🏫', label: 'Teachers' },
        { href: 'parents.html',   icon: '👨‍👩‍👧', label: 'Parents' },
      ]},
      { section: 'Academics', links: [
        { href: 'classes.html',   icon: '🏛️', label: 'Classes' },
        { href: 'subjects.html',  icon: '📚', label: 'Subjects' },
        { href: 'lessons.html',   icon: '📖', label: 'Lessons' },
        { href: 'exams.html',     icon: '📝', label: 'Exams' },
        { href: 'assignments.html', icon: '📋', label: 'Assignments' },
        { href: 'results.html',   icon: '📊', label: 'Results' },
        { href: 'attendance.html',icon: '✅', label: 'Attendance' },
      ]},
      { section: 'School', links: [
        { href: 'events.html',       icon: '📅', label: 'Events' },
        { href: 'announcements.html',icon: '📢', label: 'Announcements' },
      ]},
    ],
    teacher: [
      { section: 'Overview', links: [
        { href: 'teacher-dashboard.html', icon: '🏠', label: 'Dashboard' },
      ]},
      { section: 'Academics', links: [
        { href: 'lessons.html',    icon: '📖', label: 'My Lessons' },
        { href: 'exams.html',      icon: '📝', label: 'Exams' },
        { href: 'assignments.html',icon: '📋', label: 'Assignments' },
        { href: 'attendance.html', icon: '✅', label: 'Attendance' },
        { href: 'results.html',    icon: '📊', label: 'Results' },
      ]},
      { section: 'School', links: [
        { href: 'events.html',       icon: '📅', label: 'Events' },
        { href: 'announcements.html',icon: '📢', label: 'Announcements' },
      ]},
    ],
    student: [
      { section: 'Overview', links: [
        { href: 'student-dashboard.html', icon: '🏠', label: 'Dashboard' },
      ]},
      { section: 'Academics', links: [
        { href: 'lessons.html',    icon: '📖', label: 'Schedule' },
        { href: 'exams.html',      icon: '📝', label: 'Exams' },
        { href: 'assignments.html',icon: '📋', label: 'Assignments' },
        { href: 'results.html',    icon: '📊', label: 'My Results' },
        { href: 'attendance.html', icon: '✅', label: 'Attendance' },
      ]},
      { section: 'School', links: [
        { href: 'events.html',       icon: '📅', label: 'Events' },
        { href: 'announcements.html',icon: '📢', label: 'Announcements' },
      ]},
    ],
    parent: [
      { section: 'Overview', links: [
        { href: 'parent-dashboard.html', icon: '🏠', label: 'Dashboard' },
      ]},
      { section: 'My Children', links: [
        { href: 'results.html',    icon: '📊', label: 'Results' },
        { href: 'attendance.html', icon: '✅', label: 'Attendance' },
      ]},
      { section: 'School', links: [
        { href: 'events.html',       icon: '📅', label: 'Events' },
        { href: 'announcements.html',icon: '📢', label: 'Announcements' },
      ]},
    ],
  };

  const sections = allLinks[role] || allLinks.student;
  const currentPage = location.pathname.split('/').pop();

  let html = `
    <div class="sidebar-logo">
      <div class="logo-icon">🎓</div>
      <div>
        <div class="logo-text">SchoolMS</div>
        <div class="logo-sub">Management System</div>
      </div>
    </div>`;

  for (const sec of sections) {
    html += `<div class="sidebar-section">
      <div class="sidebar-section-label">${sec.section}</div>`;
    for (const lnk of sec.links) {
      const active = currentPage === lnk.href ? ' active' : '';
      html += `<a href="${lnk.href}" class="sidebar-link${active}">
        <span class="icon">${lnk.icon}</span>${lnk.label}
      </a>`;
    }
    html += `</div>`;
  }

  html += `<div style="flex:1"></div>
    <div style="padding:16px 12px;border-top:1px solid var(--border)">
      <button onclick="API.logout()" class="btn btn-ghost w-full" style="justify-content:center">
        🚪 Logout
      </button>
    </div>`;

  return html;
}

function initLayout(allowedRoles) {
  const user = requireAuth(allowedRoles);
  if (!user) return null;

  document.getElementById('sidebar').innerHTML = buildSidebar(user.role);
  renderUserBadge('user-info');

  // Mobile menu toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  return user;
}
</script>
