/* ==============================
   TASKFLOW — app.js
   Full Task Manager Logic
   ============================== */

'use strict';

// ─── STATE ─────────────────────────────────────────────
let tasks        = [];
let editingId    = null;
let activeFilter = 'all';
let activePriority = 'all';
let searchQuery  = '';

// ─── STORAGE ───────────────────────────────────────────
const STORAGE_KEY = 'taskflow_tasks_v1';

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : getDefaultTasks();
  } catch {
    tasks = getDefaultTasks();
  }
}

function getDefaultTasks() {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: uid(), title: 'Complete Java OOP Assignment', desc: 'Cover inheritance, polymorphism and interfaces.', category: 'study', priority: 'high', due: today, completed: false, createdAt: Date.now() },
    { id: uid(), title: 'Read Business Communication Unit 2', desc: 'Focus on formal letter writing and email etiquette.', category: 'study', priority: 'medium', due: '', completed: false, createdAt: Date.now() - 1e6 },
    { id: uid(), title: 'Update Resume on LinkedIn', desc: 'Add Anthropic AI Fluency certificate.', category: 'personal', priority: 'medium', due: '', completed: true, createdAt: Date.now() - 2e6 },
    { id: uid(), title: 'Morning Jog — 5km', desc: '', category: 'health', priority: 'low', due: today, completed: false, createdAt: Date.now() - 3e6 },
    { id: uid(), title: 'Research Chia Seed Market in Vidarbha', desc: 'Collect data on existing suppliers and soil conditions.', category: 'work', priority: 'high', due: '', completed: false, createdAt: Date.now() - 4e6 },
  ];
}

// ─── UTILITIES ─────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return { label: 'Today', overdue: false };
  if (diff === 1) return { label: 'Tomorrow', overdue: false };
  if (diff === -1) return { label: 'Yesterday', overdue: true };
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  return { label: d.toLocaleDateString('en-IN', { day:'numeric', month:'short' }), overdue: false };
}

function catEmoji(cat) {
  return { work:'💼', personal:'🏠', study:'📚', health:'🏃' }[cat] || '📌';
}

function priorityLabel(p) {
  return { high:'🔴 High', medium:'🟡 Medium', low:'🟢 Low' }[p] || p;
}

// ─── FILTER LOGIC ──────────────────────────────────────
function getFilteredTasks() {
  const today = new Date().toISOString().split('T')[0];
  return tasks
    .filter(t => {
      if (activeFilter === 'today')     return t.due === today;
      if (activeFilter === 'pending')   return !t.completed;
      if (activeFilter === 'completed') return t.completed;
      if (activeFilter.startsWith('cat-')) return t.category === activeFilter.replace('cat-', '');
      return true;
    })
    .filter(t => activePriority === 'all' || t.priority === activePriority)
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const sort = document.getElementById('sortSelect').value;
      if (sort === 'oldest') return a.createdAt - b.createdAt;
      if (sort === 'priority') { const o = {high:0,medium:1,low:2}; return o[a.priority] - o[b.priority]; }
      if (sort === 'az') return a.title.localeCompare(b.title);
      return b.createdAt - a.createdAt; // newest
    });
}

// ─── RENDER ────────────────────────────────────────────
function render() {
  const list = document.getElementById('taskList');
  const empty = document.getElementById('emptyState');
  const filtered = getFilteredTasks();

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
    list.style.display = 'none';
  } else {
    empty.style.display = 'none';
    list.style.display = 'flex';
    filtered.forEach((t, i) => {
      const el = buildTaskEl(t);
      el.style.animationDelay = `${i * 0.04}s`;
      list.appendChild(el);
    });
  }

  updateStats();
  updateSidebarCounts();
  updateProgress();
}

function buildTaskEl(t) {
  const item = document.createElement('div');
  item.className = `task-item${t.completed ? ' completed' : ''}`;
  item.dataset.priority = t.priority;
  item.dataset.id = t.id;

  const dueInfo = t.due ? formatDate(t.due) : null;

  item.innerHTML = `
    <input type="checkbox" class="task-check" ${t.completed ? 'checked' : ''} 
      aria-label="Mark complete" title="Toggle complete"/>
    <div class="task-body">
      <div class="task-title">${escapeHtml(t.title)}</div>
      ${t.desc ? `<div class="task-desc">${escapeHtml(t.desc)}</div>` : ''}
      <div class="task-meta">
        <span class="badge badge--${t.category}">${catEmoji(t.category)} ${t.category}</span>
        <span class="badge badge--${t.priority}">${priorityLabel(t.priority)}</span>
        ${dueInfo ? `<span class="badge ${dueInfo.overdue ? 'badge--overdue' : 'badge--due'}">📅 ${dueInfo.label}</span>` : ''}
      </div>
    </div>
    <div class="task-actions">
      <button class="icon-btn edit" title="Edit task" aria-label="Edit">✏</button>
      <button class="icon-btn del"  title="Delete task" aria-label="Delete">🗑</button>
    </div>
  `;

  item.querySelector('.task-check').addEventListener('change', () => toggleTask(t.id));
  item.querySelector('.edit').addEventListener('click', () => openEdit(t.id));
  item.querySelector('.del').addEventListener('click', () => deleteTask(t.id));

  return item;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── STATS ─────────────────────────────────────────────
function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const high    = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statDone').textContent    = done;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statHigh').textContent    = high;
}

function updateSidebarCounts() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('countAll').textContent       = tasks.length;
  document.getElementById('countToday').textContent     = tasks.filter(t => t.due === today).length;
  document.getElementById('countPending').textContent   = tasks.filter(t => !t.completed).length;
  document.getElementById('countCompleted').textContent = tasks.filter(t => t.completed).length;
}

function updateProgress() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const circle = document.getElementById('progressCircle');
  const circumference = 201;
  circle.style.strokeDashoffset = circumference - (circumference * pct / 100);
  document.getElementById('progressPct').textContent = pct + '%';
}

// ─── ACTIONS ───────────────────────────────────────────
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveTasks();
  render();
  showToast(t.completed ? '✓ Task completed!' : 'Task reopened', t.completed ? 'success' : 'info');
}

function deleteTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const title = tasks[idx].title;
  tasks.splice(idx, 1);
  saveTasks();
  render();
  showToast(`🗑 "${title.slice(0,30)}…" deleted`, 'error');
}

function openEdit(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Task';
  document.getElementById('taskTitle').value    = t.title;
  document.getElementById('taskDesc').value     = t.desc || '';
  document.getElementById('taskCategory').value = t.category;
  document.getElementById('taskPriority').value = t.priority;
  document.getElementById('taskDue').value      = t.due || '';
  openModal();
}

function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) {
    document.getElementById('taskTitle').focus();
    document.getElementById('taskTitle').style.borderColor = 'var(--neon-red)';
    setTimeout(() => document.getElementById('taskTitle').style.borderColor = '', 1500);
    showToast('⚠ Title is required', 'error');
    return;
  }

  const data = {
    title,
    desc:      document.getElementById('taskDesc').value.trim(),
    category:  document.getElementById('taskCategory').value,
    priority:  document.getElementById('taskPriority').value,
    due:       document.getElementById('taskDue').value,
    completed: false,
  };

  if (editingId) {
    const idx = tasks.findIndex(t => t.id === editingId);
    tasks[idx] = { ...tasks[idx], ...data };
    showToast('✏ Task updated!', 'info');
  } else {
    tasks.unshift({ id: uid(), createdAt: Date.now(), ...data });
    showToast('✓ Task added!', 'success');
  }

  saveTasks();
  render();
  closeModal();
}

// ─── MODAL ─────────────────────────────────────────────
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('taskTitle').focus(), 100);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('taskTitle').value    = '';
  document.getElementById('taskDesc').value     = '';
  document.getElementById('taskCategory').value = 'work';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskDue').value      = '';
  document.getElementById('modalTitle').textContent = 'New Task';
  editingId = null;
}

// ─── TOAST ─────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── DATE DISPLAY ──────────────────────────────────────
function setDateDisplay() {
  const d = new Date();
  document.getElementById('dateDisplay').textContent =
    d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

// ─── SIDEBAR ───────────────────────────────────────────
const sidebar = document.getElementById('sidebar');

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
document.getElementById('sidebarClose').addEventListener('click', () => {
  sidebar.classList.remove('open');
});

// ─── EVENT BINDINGS ────────────────────────────────────
document.getElementById('openModal').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
document.getElementById('saveTask').addEventListener('click', saveTask);

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('searchInput').focus(); }
});

// Enter to save in modal
document.getElementById('taskTitle').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveTask();
});

// Sidebar filter buttons
document.querySelectorAll('.nav-item[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    const labels = { all:'All Tasks', today:'Today', pending:'Pending', completed:'Completed', 'cat-work':'Work', 'cat-personal':'Personal', 'cat-study':'Study', 'cat-health':'Health' };
    document.getElementById('greetingTitle').textContent = labels[activeFilter] || 'Tasks';
    render();
    if (window.innerWidth < 900) sidebar.classList.remove('open');
  });
});

// Priority filter buttons
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePriority = btn.dataset.priority;
    render();
  });
});

// Search
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

// Sort
document.getElementById('sortSelect').addEventListener('change', render);

// ─── INIT ──────────────────────────────────────────────
(function init() {
  loadTasks();
  setDateDisplay();
  render();

  // Animate progress circle on load
  setTimeout(updateProgress, 300);

  console.log('%c ⚡ TaskFlow ', 'background:linear-gradient(135deg,#4f9eff,#a78bfa);color:#fff;font-weight:700;padding:4px 8px;border-radius:4px;font-size:0.9rem;');
  console.log('Tip: Ctrl+K to focus search');
})();
