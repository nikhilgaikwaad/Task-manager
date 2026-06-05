# ⚡ TaskFlow — Smart Task Manager

> A beautiful, fully functional task manager with glassmorphism neon aesthetic. No frameworks, no dependencies — pure HTML, CSS & JavaScript.

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![LocalStorage](https://img.shields.io/badge/Storage-localStorage-blue)

---

## 🎯 Features

### Core Functionality
- ✅ **Add / Edit / Delete** tasks
- ✅ **Mark Complete** — toggle task completion with checkbox
- ✅ **Local Storage** — tasks persist across browser sessions
- ✅ **Search** — real-time task search (Ctrl+K shortcut)
- ✅ **Sort** — by Newest, Oldest, Priority, A→Z

### Organization
- 📁 **4 Categories** — Work, Personal, Study, Health
- 🔴 **3 Priority Levels** — High, Medium, Low
- 📅 **Due Dates** — with smart labels (Today, Tomorrow, Overdue)
- 🔍 **Filter Views** — All, Today, Pending, Completed, by Category

### UI / UX
- 🌌 **Glassmorphism + Neon** dark aesthetic
- 📊 **Stats Dashboard** — Total, Pending, Done, High Priority counts
- 🔄 **Progress Ring** — animated SVG ring showing completion %
- 🍞 **Toast Notifications** — colored success/error/info alerts
- ✨ **Smooth Animations** — task reveal, modal, hover effects
- 📱 **Fully Responsive** — mobile sidebar drawer, stacked layout
- ⌨️ **Keyboard Shortcuts** — Ctrl+K for search, Escape to close modal

---

## 📁 Project Structure

```
taskflow/
├── index.html        # App shell, modal, sidebar, layout
├── css/
│   └── style.css     # Glassmorphism dark theme, animations, responsive
├── js/
│   └── app.js        # Full task logic, storage, filtering, rendering
├── README.md         # This file
├── .gitignore        # Ignore OS/editor junk
└── LICENSE           # MIT License
```

---

## 🚀 Getting Started

### Run Locally
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
# Simply open index.html in your browser — no server needed!
```

### Deploy on GitHub Pages
1. Push to GitHub
2. **Settings → Pages → Deploy from branch → main → / (root)**
3. Live at: `https://YOUR_USERNAME.github.io/taskflow`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Focus search bar |
| `Escape` | Close modal |
| `Enter` (in title field) | Save task |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Font — Headings** | Syne (Google Fonts) |
| **Font — Code/Labels** | JetBrains Mono |
| **Background** | `#080b14` |
| **Accent Blue** | `#4f9eff` |
| **Accent Purple** | `#a78bfa` |
| **Success Green** | `#34d399` |
| **Warning Orange** | `#fb923c` |
| **Danger Red** | `#f87171` |
| **Border Radius** | `14px` |

---

## 🛠️ Customization

### Add More Categories
In `index.html`, add a new select option:
```html
<option value="finance">💰 Finance</option>
```

In `js/app.js`, add emoji mapping:
```js
function catEmoji(cat) {
  return { ..., finance: '💰' }[cat] || '📌';
}
```

In `css/style.css`, add badge color:
```css
.badge--finance { background: rgba(250,204,21,0.1); border-color: rgba(250,204,21,0.2); color: #facc15; }
```

### Change Accent Color
In `css/style.css`:
```css
:root {
  --neon-blue: #4f9eff;  /* Change to any color */
}
```

### Clear All Tasks
Open browser console and run:
```js
localStorage.removeItem('taskflow_tasks_v1'); location.reload();
```

---

## 📦 Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic structure, ARIA labels |
| **CSS3** | Variables, Grid, Flexbox, animations, backdrop-filter |
| **Vanilla JS** | Task CRUD, IntersectionObserver, localStorage |
| **Google Fonts** | Syne + JetBrains Mono |
| **SVG** | Animated progress ring |

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 80+ | ✅ Full |
| Firefox 75+ | ✅ Full |
| Safari 13.1+ | ✅ Full |
| Edge 80+ | ✅ Full |

> Note: `backdrop-filter` (glassmorphism blur) is not supported in Firefox by default. The app still works perfectly, just without the blur effect.

---

## 📄 License

MIT — free to use, modify, and share.

---

> Built by **Nikhil** · Maharashtra, India 🇮🇳  
> Part of frontend portfolio projects.
