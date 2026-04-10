/**
 * COURSEWORK PAGE — Sort & filter logic
 * Depends on: courses.js loaded before this file
 */

// ── CLASSIFICATION HELPERS ──────────────────────────────────────────────────
const BUSINESS_CODES = new Set(['ACC 310F','MIS 302F','MKT 320F','LEB 320F','FIN 320F']);

function subjectGroup(c) {
  const prefix = c.code.split(' ')[0];
  if (prefix === 'ECE') return 'Major Related Courses';
  if (prefix === 'M')   return 'Mathematics Courses';
  if (BUSINESS_CODES.has(c.code)) return 'Business Minor Courses';
  return 'Other Courses';
}

const SUBJECT_ORDER = [
  'Major Related Courses',
  'Mathematics Courses',
  'Business Minor Courses',
  'Other Courses',
];

const RELEVANCE_MAP = {
  'ECE 460N': 'Architecture/Systems Related Core Courses',
  'ECE 445L': 'Architecture/Systems Related Core Courses',
  'ECE 360C': 'Architecture/Systems Related Core Courses',
  'ECE 316':  'Architecture/Systems Related Core Courses',
  'M 325K':   'Architecture/Systems Related Core Courses',

  'ECE 422C': 'Architecture/Systems Related Electives',
  'ECE 445S': 'Architecture/Systems Related Electives',
  'ECE 351M': 'Architecture/Systems Related Electives',

  'ECE 302':  'Introductory / Required Lower Division Courses',
  'ECE 306':  'Introductory / Required Lower Division Courses',
  'ECE 319H': 'Introductory / Required Lower Division Courses',
  'ECE 312H': 'Introductory / Required Lower Division Courses',
  'ECE 411':  'Introductory / Required Lower Division Courses',
  'ECE 313':  'Introductory / Required Lower Division Courses',
  'M 408D':   'Introductory / Required Lower Division Courses',

  'ECE 351K': 'Required Upper Division Courses',
  'ECE 333T': 'Required Upper Division Courses',
  'M 340L':   'Required Upper Division Courses',
};

function relevanceGroup(c) {
  if (BUSINESS_CODES.has(c.code)) return 'Business Minor Courses';
  if (RELEVANCE_MAP[c.code]) return RELEVANCE_MAP[c.code];
  if (c.code === 'M 427J') {
    return c.semOrder === 2
      ? 'Required Upper Division Courses'
      : 'Architecture/Systems Related Electives';
  }
  return 'Other Courses';
}

const RELEVANCE_ORDER = [
  'Architecture/Systems Related Core Courses',
  'Architecture/Systems Related Electives',
  'Introductory / Required Lower Division Courses',
  'Required Upper Division Courses',
  'Business Minor Courses',
  'Other Courses',
];

// ── CARD TEMPLATE ───────────────────────────────────────────────────────────
function cardHTML(c, showSemester) {
  const semTag = showSemester
    ? `<span class="card-semester">${c.semester}</span>`
    : '';
  const href = c.slug ? `courses/${c.slug}.html` : '#';
  const isLinked = !!c.slug;
  const tag = isLinked ? 'a' : 'div';
  const hrefAttr = isLinked ? `href="${href}"` : '';
  const cursor = isLinked ? 'pointer' : 'default';

  return `
    <${tag} class="course-card" ${hrefAttr} style="cursor:${cursor}">
      <div class="card-meta">
        <span class="card-code">${c.code}</span>${semTag}
      </div>
      <div class="card-title">${c.title}</div>
      <p class="card-desc">${c.desc}</p>
      <div class="card-footer-row">
        <div class="card-tags">${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${isLinked ? '<span class="card-arrow">↗</span>' : ''}
      </div>
    </${tag}>`;
}

function sectionHTML(label, cards, showSemester) {
  return `
    <div class="section-block">
      <div class="semester-header">
        <span class="semester-label">${label}</span>
        <div class="semester-divider"></div>
        <span class="semester-count">${cards.length} course${cards.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="course-grid">${cards.map(c => cardHTML(c, showSemester)).join('')}</div>
    </div>`;
}

function groupBy(arr, keyFn, orderArr) {
  const map = {};
  arr.forEach(c => {
    const k = keyFn(c);
    if (!map[k]) map[k] = [];
    map[k].push(c);
  });
  return orderArr.filter(k => map[k]).map(k => ({ label: k, cards: map[k] }));
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function render(mode) {
  const alpha = document.getElementById('alpha-toggle').checked;

  function maybeSort(arr) {
    return alpha ? [...arr].sort((a, b) => a.code.localeCompare(b.code)) : arr;
  }

  const container = document.getElementById('course-container');
  let html = '';

  if (mode === 'chron-asc' || mode === 'chron-desc') {
    const sorted = [...courses].sort((a, b) =>
      mode === 'chron-asc' ? a.semOrder - b.semOrder : b.semOrder - a.semOrder
    );
    const semesters = [...new Set(sorted.map(c => c.semester))];
    semesters.forEach(sem => {
      html += sectionHTML(sem, maybeSort(sorted.filter(c => c.semester === sem)), false);
    });
  } else if (mode === 'subject') {
    groupBy(courses, subjectGroup, SUBJECT_ORDER).forEach(({ label, cards }) => {
      html += sectionHTML(label, maybeSort(cards), true);
    });
  } else if (mode === 'relevance') {
    groupBy(courses, relevanceGroup, RELEVANCE_ORDER).forEach(({ label, cards }) => {
      html += sectionHTML(label, maybeSort(cards), true);
    });
  }

  container.innerHTML = html;
}

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.mode);
    });
  });

  document.getElementById('alpha-toggle').addEventListener('change', () => {
    const mode = document.querySelector('.sort-btn.active').dataset.mode;
    render(mode);
  });

  render('chron-asc');
});
