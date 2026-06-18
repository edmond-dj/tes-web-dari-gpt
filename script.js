const themeToggle = document.querySelector('#themeToggle');
const noteForm = document.querySelector('#noteForm');
const noteInput = document.querySelector('#noteInput');
const noteList = document.querySelector('#noteList');

const STORAGE_KEY = 'tes-web-gpt-notes';
const THEME_KEY = 'tes-web-gpt-theme';

let notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
  noteList.innerHTML = '';

  if (notes.length === 0) {
    noteList.innerHTML = '<li>Belum ada catatan. Tulis dulu satu ide kecil, biar project jalan.</li>';
    return;
  }

  notes.forEach((note, index) => {
    const item = document.createElement('li');
    const text = document.createElement('span');
    const button = document.createElement('button');

    text.textContent = note;
    button.textContent = 'Hapus';
    button.className = 'delete-btn';
    button.type = 'button';
    button.addEventListener('click', () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    });

    item.appendChild(text);
    item.appendChild(button);
    noteList.appendChild(item);
  });
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? 'Mode Terang' : 'Mode Gelap';
  localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = noteInput.value.trim();

  if (!value) return;

  notes.unshift(value);
  saveNotes();
  renderNotes();
  noteInput.value = '';
});

applyTheme(localStorage.getItem(THEME_KEY) || 'light');
renderNotes();
