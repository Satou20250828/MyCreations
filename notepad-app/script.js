(() => {
  const LS_KEY = 'simple_notes_v1';

  const notesListEl = document.getElementById('notesList');
  const titleInput = document.getElementById('titleInput');
  const contentInput = document.getElementById('contentInput');
  const saveBtn = document.getElementById('saveBtn');
  const newBtn = document.getElementById('newBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const searchInput = document.getElementById('searchInput');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');
  const infoCreated = document.getElementById('infoCreated');
  const infoUpdated = document.getElementById('infoUpdated');

  let notes = [];
  let currentId = null;
  let autoSaveTimer = null;

  const nowISO = () => new Date().toISOString();
  const fmtShort = iso => new Date(iso).toLocaleString();

  function loadNotes() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      notes = raw ? JSON.parse(raw) : [];
    } catch (e) {
      notes = [];
    }
  }

  function saveNotesToStorage() {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }

  function renderNotesList(filter = '') {
    notesListEl.innerHTML = '';
    const q = filter.trim().toLowerCase();
    const filtered = notes
      .filter(n => {
        if (!q) return true;
        return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
      })
      .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'メモがありません';
      li.style.color = '#888';
      notesListEl.appendChild(li);
      return;
    }

    filtered.forEach(n => {
      const li = document.createElement('li');
      li.className = 'note-item' + (n.id === currentId ? ' active' : '');
      li.dataset.id = n.id;

      const title = document.createElement('div');
      title.className = 'note-title';
      title.textContent = n.title || '(無題)';

      const meta = document.createElement('div');
      meta.className = 'note-meta';
      meta.textContent = `更新: ${fmtShort(n.updatedAt)}`;

      li.appendChild(title);
      li.appendChild(meta);

      li.addEventListener('click', () => selectNote(n.id));

      notesListEl.appendChild(li);
    });
  }

  function selectNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    currentId = note.id;
    titleInput.value = note.title || '';
    contentInput.value = note.content || '';
    infoCreated.textContent = `作成: ${fmtShort(note.createdAt)}`;
    infoUpdated.textContent = `更新: ${fmtShort(note.updatedAt)}`;
    renderNotesList(searchInput.value);
  }

  function newNote() {
    currentId = null;
    titleInput.value = '';
    contentInput.value = '';
    infoCreated.textContent = '';
    infoUpdated.textContent = '';
    renderNotesList(searchInput.value);
    titleInput.focus();
  }

  function saveCurrentNote(showToast = true) {
    const title = titleInput.value.trim();
    const content = contentInput.value;

    if (!title && !content) {
      if (!currentId) return;
    }

    if (currentId) {
      const note = notes.find(n => n.id === currentId);
      if (!note) return;
      note.title = title;
      note.content = content;
      note.updatedAt = nowISO();
    } else {
      const id = String(Date.now()) + Math.floor(Math.random()*1000);
      const createdAt = nowISO();
      const note = { id, title, content, createdAt, updatedAt: createdAt };
      notes.push(note);
      currentId = id;
    }
    saveNotesToStorage();
    renderNotesList(searchInput.value);
    selectNote(currentId);

    if (showToast) showSavedToast();
  }

  function deleteCurrentNote() {
    if (!currentId) return;
    if (!confirm('このメモを削除しますか？')) return;
    notes = notes.filter(n => n.id !== currentId);
    saveNotesToStorage();
    newNote();
    renderNotesList(searchInput.value);
  }

  // --- 自動保存機能 ---
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      saveCurrentNote(false); // トースト非表示で静かに保存
    }, 1500); // 入力停止から1.5秒で保存
  }

  // --- 保存完了表示（任意） ---
  function showSavedToast() {
    let toast = document.createElement('div');
    toast.textContent = '保存しました';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#3b82f6';
    toast.style.color = '#fff';
    toast.style.padding = '6px 12px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    toast.style.opacity = '0.9';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1200);
  }

  // Export / Import は省略（前と同じ）

  saveBtn.addEventListener('click', () => saveCurrentNote());
  newBtn.addEventListener('click', newNote);
  deleteBtn.addEventListener('click', deleteCurrentNote);

  // --- 入力イベントで自動保存を予約 ---
  titleInput.addEventListener('input', scheduleAutoSave);
  contentInput.addEventListener('input', scheduleAutoSave);

  searchInput.addEventListener('input', e => renderNotesList(e.target.value));

  // Ctrl+S 保存
  document.addEventListener('keydown', (e) => {
    const meta = navigator.platform.includes('Mac') ? e.metaKey : e.ctrlKey;
    if (meta && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveCurrentNote();
    }
  });

  function init() {
    loadNotes();
    renderNotesList();
    if (notes.length > 0) {
      notes.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      selectNote(notes[0].id);
    } else {
      newNote();
    }
  }

  init();
})();
