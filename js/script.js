// ---------- NAV: fondo al hacer scroll + menú móvil ----------
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ---------- Revelado suave al entrar en pantalla ----------
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// ---------- Formulario de contacto (demo, sin backend) ----------
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = bookingForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Mensaje enviado ✦';
    bookingForm.reset();
    setTimeout(() => { btn.textContent = original; }, 2600);
  });
}

// =====================================================================
// PÁGINA DE REPERTORIO — construida a partir de data.js (REPERTOIRE)
// =====================================================================
const repBody = document.getElementById('rep-body');

if (repBody && typeof REPERTOIRE !== 'undefined') {
  const tabsWrap = document.getElementById('rep-tabs');
  const searchInput = document.getElementById('rep-search');
  const noResults = document.getElementById('no-results');

  // Construir botones de pestañas
  const genres = REPERTOIRE.map(g => g.genre);
  const allBtn = document.createElement('button');
  allBtn.className = 'tab-btn active';
  allBtn.dataset.genre = 'todos';
  allBtn.textContent = 'Todos';
  tabsWrap.appendChild(allBtn);

  genres.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.genre = g;
    btn.textContent = g;
    tabsWrap.appendChild(btn);
  });

  // Construir bloques de canciones
  REPERTOIRE.forEach(group => {
    const block = document.createElement('div');
    block.className = 'genre-block';
    block.dataset.genre = group.genre;

    const head = document.createElement('div');
    head.className = 'genre-block-head';
    head.innerHTML = `<h2>${group.genre}</h2><span>${group.songs.length} canciones</span>`;
    block.appendChild(head);

    const table = document.createElement('div');
    table.className = 'song-table';

    group.songs.forEach((song, i) => {
      const row = document.createElement('div');
      row.className = 'song-row';
      row.dataset.title = song.title.toLowerCase();
      row.dataset.artist = song.artist.toLowerCase();
      row.innerHTML = `
        <span class="song-idx">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <div class="song-title">${song.title}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
        <span class="song-tag">${group.genre}</span>
      `;
      table.appendChild(row);
    });

    block.appendChild(table);
    repBody.appendChild(block);
  });

  const genreBlocks = () => Array.from(repBody.querySelectorAll('.genre-block'));

  function applyFilters() {
    const activeTab = tabsWrap.querySelector('.tab-btn.active').dataset.genre;
    const query = searchInput.value.trim().toLowerCase();
    let anyVisible = false;

    genreBlocks().forEach(block => {
      const matchesGenre = activeTab === 'todos' || block.dataset.genre === activeTab;
      let blockHasVisibleRow = false;

      block.querySelectorAll('.song-row').forEach(row => {
        const matchesQuery = !query || row.dataset.title.includes(query) || row.dataset.artist.includes(query);
        const visible = matchesGenre && matchesQuery;
        row.style.display = visible ? 'grid' : 'none';
        if (visible) blockHasVisibleRow = true;
      });

      block.style.display = blockHasVisibleRow ? 'block' : 'none';
      if (blockHasVisibleRow) anyVisible = true;
    });

    noResults.classList.toggle('show', !anyVisible);
  }

  tabsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);
}
