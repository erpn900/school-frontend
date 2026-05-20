// ============================================================
// api.js  –  REST client for the Google Apps Script backend
// All pages import this. Set BACKEND_URL before first use.
// ============================================================

const API = (() => {
  // ── Replace with your deployed Web App URL ──────────────
  // After deploying the Apps Script:
  //   Script Editor → Deploy → New Deployment → Web App
  //   Copy the URL and paste below.
  const BASE_URL = window.BACKEND_URL || 'https://script.google.com/macros/s/AKfycbz42jbxkFCmq0F9F8jo7kka9PuYraYBO8vU1z0FSkVRxmHVt069gy9JYdP06K5-vrECRw/exec';

  let _token = localStorage.getItem('school_token') || '';
  let _user  = null;
  try { _user = JSON.parse(localStorage.getItem('school_user') || 'null'); } catch (_) {}

  function setAuth(token, user) {
    _token = token;
    _user  = user;
    localStorage.setItem('school_token', token);
    localStorage.setItem('school_user', JSON.stringify(user));
  }

  function clearAuth() {
    _token = '';
    _user  = null;
    localStorage.removeItem('school_token');
    localStorage.removeItem('school_user');
  }

  function getUser()  { return _user; }
  function getToken() { return _token; }
  function isLoggedIn() { return !!_token; }

  // Build query string
  function qs(params) {
    const p = { ...params, token: _token };
    return Object.entries(p)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
      .join('&');
  }

  async function get(path, params = {}) {
    const url = `${BASE_URL}?path=${encodeURIComponent(path)}&${qs(params)}`;
    const res = await fetch(url, { redirect: 'follow' });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  async function post(path, body = {}) {
    const url = `${BASE_URL}?path=${encodeURIComponent(path)}&token=${encodeURIComponent(_token)}`;
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  }

  // ── Auth ────────────────────────────────────────────────
  async function login(username, password, role) {
    const data = await post('auth/login', { username, password, role });
    setAuth(data.token, { username: data.username, role: data.role, id: data.id });
    return data;
  }

  function logout() {
    clearAuth();
    window.location.href = '../index.html';
  }

  // ── Generic CRUD ────────────────────────────────────────
  function listResource(resource, params) { return get(resource, params); }
  function createResource(resource, data) { return post(resource, data); }
  function updateResource(resource, data) { return post(resource, data); }
  function deleteResource(resource, id)   { return post(resource + '/delete', { id }); }

  // ── Dashboard ───────────────────────────────────────────
  function getDashboardStats()          { return get('dashboard/stats'); }

  // ── Students ────────────────────────────────────────────
  function getStudents(params)          { return get('students', params); }
  function createStudent(data)          { return post('students', data); }
  function updateStudent(data)          { return post('students', data); }
  function deleteStudent(id)            { return post('students/delete', { id }); }

  // ── Teachers ────────────────────────────────────────────
  function getTeachers(params)          { return get('teachers', params); }
  function createTeacher(data)          { return post('teachers', data); }
  function updateTeacher(data)          { return post('teachers', data); }
  function deleteTeacher(id)            { return post('teachers/delete', { id }); }

  // ── Parents ─────────────────────────────────────────────
  function getParents(params)           { return get('parents', params); }
  function createParent(data)           { return post('parents', data); }
  function updateParent(data)           { return post('parents', data); }
  function deleteParent(id)             { return post('parents/delete', { id }); }

  // ── Classes ─────────────────────────────────────────────
  function getClasses(params)           { return get('classes', params); }
  function createClass(data)            { return post('classes', data); }
  function updateClass(data)            { return post('classes', data); }
  function deleteClass(id)              { return post('classes/delete', { id }); }

  // ── Subjects ────────────────────────────────────────────
  function getSubjects(params)          { return get('subjects', params); }
  function createSubject(data)          { return post('subjects', data); }
  function updateSubject(data)          { return post('subjects', data); }
  function deleteSubject(id)            { return post('subjects/delete', { id }); }

  // ── Grades ──────────────────────────────────────────────
  function getGrades()                  { return get('grades'); }

  // ── Lessons ─────────────────────────────────────────────
  function getLessons(params)           { return get('lessons', params); }
  function createLesson(data)           { return post('lessons', data); }
  function updateLesson(data)           { return post('lessons', data); }
  function deleteLesson(id)             { return post('lessons/delete', { id }); }

  // ── Exams ───────────────────────────────────────────────
  function getExams(params)             { return get('exams', params); }
  function createExam(data)             { return post('exams', data); }
  function updateExam(data)             { return post('exams', data); }
  function deleteExam(id)               { return post('exams/delete', { id }); }

  // ── Assignments ─────────────────────────────────────────
  function getAssignments(params)       { return get('assignments', params); }
  function createAssignment(data)       { return post('assignments', data); }
  function updateAssignment(data)       { return post('assignments', data); }
  function deleteAssignment(id)         { return post('assignments/delete', { id }); }

  // ── Results ─────────────────────────────────────────────
  function getResults(params)           { return get('results', params); }
  function createResult(data)           { return post('results', data); }
  function updateResult(data)           { return post('results', data); }
  function deleteResult(id)             { return post('results/delete', { id }); }

  // ── Attendance ──────────────────────────────────────────
  function getAttendance(params)        { return get('attendance', params); }
  function markAttendance(data)         { return post('attendance', data); }
  function deleteAttendance(id)         { return post('attendance/delete', { id }); }

  // ── Events ──────────────────────────────────────────────
  function getEvents(params)            { return get('events', params); }
  function createEvent(data)            { return post('events', data); }
  function updateEvent(data)            { return post('events', data); }
  function deleteEvent(id)              { return post('events/delete', { id }); }

  // ── Announcements ───────────────────────────────────────
  function getAnnouncements(params)     { return get('announcements', params); }
  function createAnnouncement(data)     { return post('announcements', data); }
  function updateAnnouncement(data)     { return post('announcements', data); }
  function deleteAnnouncement(id)       { return post('announcements/delete', { id }); }

  return {
    login, logout, getUser, getToken, isLoggedIn, setAuth, clearAuth,
    getDashboardStats,
    getStudents, createStudent, updateStudent, deleteStudent,
    getTeachers, createTeacher, updateTeacher, deleteTeacher,
    getParents,  createParent,  updateParent,  deleteParent,
    getClasses,  createClass,   updateClass,   deleteClass,
    getSubjects, createSubject, updateSubject, deleteSubject,
    getGrades,
    getLessons,  createLesson,  updateLesson,  deleteLesson,
    getExams,    createExam,    updateExam,    deleteExam,
    getAssignments, createAssignment, updateAssignment, deleteAssignment,
    getResults,  createResult,  updateResult,  deleteResult,
    getAttendance, markAttendance, deleteAttendance,
    getEvents,   createEvent,   updateEvent,   deleteEvent,
    getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
    listResource, createResource, updateResource, deleteResource,
  };
})();
