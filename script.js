const themeToggle = document.querySelector('#themeToggle');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.querySelector('#pageTitle');

const studentForm = document.querySelector('#studentForm');
const studentName = document.querySelector('#studentName');
const studentClass = document.querySelector('#studentClass');
const studentList = document.querySelector('#studentList');

const teacherForm = document.querySelector('#teacherForm');
const teacherName = document.querySelector('#teacherName');
const teacherSubject = document.querySelector('#teacherSubject');
const teacherList = document.querySelector('#teacherList');

const attendanceForm = document.querySelector('#attendanceForm');
const attendanceName = document.querySelector('#attendanceName');
const attendanceClass = document.querySelector('#attendanceClass');
const attendanceStatus = document.querySelector('#attendanceStatus');
const attendanceList = document.querySelector('#attendanceList');

const noteForm = document.querySelector('#noteForm');
const noteInput = document.querySelector('#noteInput');
const noteList = document.querySelector('#noteList');

const totalStudents = document.querySelector('#totalStudents');
const totalTeachers = document.querySelector('#totalTeachers');
const totalPresent = document.querySelector('#totalPresent');
const totalNotes = document.querySelector('#totalNotes');
const attendancePercent = document.querySelector('#attendancePercent');
const attendanceBar = document.querySelector('#attendanceBar');

const keys = {
  theme: 'dashboard-theme',
  students: 'dashboard-students',
  teachers: 'dashboard-teachers',
  attendance: 'dashboard-attendance',
  notes: 'dashboard-notes'
};

let students = load(keys.students, [
  { name: 'Maria Yosefa', className: 'X' },
  { name: 'Andreas Nono', className: 'XI' },
  { name: 'Kristina Bela', className: 'XII' }
]);

let teachers = load(keys.teachers, [
  { name: 'Edmond Djawa', subject: 'Informatika' },
  { name: 'Ibu Maria', subject: 'Bahasa Indonesia' }
]);

let attendance = load(keys.attendance, [
  { name: 'Maria Yosefa', className: 'X', status: 'Hadir' },
  { name: 'Andreas Nono', className: 'XI', status: 'Izin' }
]);

let notes = load(keys.notes, [
  'Cek data absensi kelas X sebelum rapat.',
  'Tambahkan fitur export Excel pada versi berikutnya.'
]);

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function switchPage(pageId) {
  pages.forEach(page => page.classList.toggle('active', page.id === pageId));
  menuItems.forEach(item => item.classList.toggle('active', item.dataset.page === pageId));

  const activeItem = document.querySelector(`[data-page="${pageId}"]`);
  pageTitle.textContent = activeItem ? activeItem.textContent.replace(/[📊✅🎓👨‍🏫📝]/g, '').trim() : 'Dashboard';
}

menuItems.forEach(item => {
  item.addEventListener('click', () => switchPage(item.dataset.page));
});

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? 'Mode Terang' : 'Mode Gelap';
  localStorage.setItem(keys.theme, theme);
}

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(nextTheme);
});

function createItem(title, subtitle, badge, onDelete) {
  const item = document.createElement('div');
  item.className = 'list-item';

  const main = document.createElement('div');
  main.className = 'item-main';
  main.innerHTML = `<strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle)}</small>`;

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
  right.style.alignItems = 'center';

  if (badge) {
    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = badge;
    right.appendChild(status);
  }

  const button = document.createElement('button');
  button.className = 'remove-btn';
  button.type = 'button';
  button.textContent = 'Hapus';
  button.addEventListener('click', onDelete);
  right.appendChild(button);

  item.appendChild(main);
  item.appendChild(right);
  return item;
}

function emptyMessage(text) {
  const empty = document.createElement('div');
  empty.className = 'empty';
  empty.textContent = text;
  return empty;
}

function renderStudents() {
  studentList.innerHTML = '';
  if (students.length === 0) studentList.appendChild(emptyMessage('Belum ada data siswa.'));

  students.forEach((student, index) => {
    studentList.appendChild(createItem(student.name, `Kelas ${student.className}`, null, () => {
      students.splice(index, 1);
      save(keys.students, students);
      renderAll();
    }));
  });
}

function renderTeachers() {
  teacherList.innerHTML = '';
  if (teachers.length === 0) teacherList.appendChild(emptyMessage('Belum ada data guru.'));

  teachers.forEach((teacher, index) => {
    teacherList.appendChild(createItem(teacher.name, teacher.subject, null, () => {
      teachers.splice(index, 1);
      save(keys.teachers, teachers);
      renderAll();
    }));
  });
}

function renderAttendance() {
  attendanceList.innerHTML = '';
  if (attendance.length === 0) attendanceList.appendChild(emptyMessage('Belum ada rekap absensi.'));

  attendance.forEach((record, index) => {
    attendanceList.appendChild(createItem(record.name, `Kelas ${record.className}`, record.status, () => {
      attendance.splice(index, 1);
      save(keys.attendance, attendance);
      renderAll();
    }));
  });
}

function renderNotes() {
  noteList.innerHTML = '';
  if (notes.length === 0) noteList.appendChild(emptyMessage('Belum ada catatan.'));

  notes.forEach((note, index) => {
    noteList.appendChild(createItem(note, 'Catatan sekolah', null, () => {
      notes.splice(index, 1);
      save(keys.notes, notes);
      renderAll();
    }));
  });
}

function renderStats() {
  const present = attendance.filter(item => item.status === 'Hadir').length;
  const percent = attendance.length === 0 ? 0 : Math.round((present / attendance.length) * 100);

  totalStudents.textContent = students.length;
  totalTeachers.textContent = teachers.length;
  totalPresent.textContent = present;
  totalNotes.textContent = notes.length;
  attendancePercent.textContent = `${percent}%`;
  attendanceBar.style.width = `${percent}%`;
}

function renderAll() {
  renderStudents();
  renderTeachers();
  renderAttendance();
  renderNotes();
  renderStats();
}

studentForm.addEventListener('submit', event => {
  event.preventDefault();
  students.unshift({ name: studentName.value.trim(), className: studentClass.value });
  save(keys.students, students);
  studentForm.reset();
  renderAll();
});

teacherForm.addEventListener('submit', event => {
  event.preventDefault();
  teachers.unshift({ name: teacherName.value.trim(), subject: teacherSubject.value.trim() });
  save(keys.teachers, teachers);
  teacherForm.reset();
  renderAll();
});

attendanceForm.addEventListener('submit', event => {
  event.preventDefault();
  attendance.unshift({
    name: attendanceName.value.trim(),
    className: attendanceClass.value,
    status: attendanceStatus.value
  });
  save(keys.attendance, attendance);
  attendanceForm.reset();
  renderAll();
});

noteForm.addEventListener('submit', event => {
  event.preventDefault();
  notes.unshift(noteInput.value.trim());
  save(keys.notes, notes);
  noteForm.reset();
  renderAll();
});

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

applyTheme(localStorage.getItem(keys.theme) || 'light');
renderAll();
