// File: src/scripts/pages/bookmark-page.js
import BookmarkPresenter from '../../presenter/bookmark-presenter';
import Database from '../../data/database';

export default class BookmarkPage {
  constructor() {
    this.presenter = new BookmarkPresenter({ view: this, model: Database });
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita yang Disimpan</h1>
        <div id="bookmarked-stories">Memuat cerita...</div>
      </section>
    `;
  }

  async afterRender() {
    this.presenter.loadBookmarkedStories();
  }

// File: bookmark-page.js

showStories(stories) {
  const container = document.querySelector('#bookmarked-stories');
  if (!stories || stories.length === 0) {
    this.showEmpty();
    return;
  }

  const storyList = stories.map((story) => `
    <article class="story-item">
      <h2>${story.name}</h2>
      <img src="${story.photoUrl}" alt="${story.description}" width="250" />
      <p><strong>Deskripsi:</strong> ${story.description}</p>
      <p><strong>Tanggal:</strong> ${new Date(story.createdAt).toLocaleDateString()}</p>
      <p><strong>Koordinat:</strong> ${story.lat}, ${story.lon}</p>
      <button class="remove-bookmark-btn" data-id="${story.id}">Hapus</button>
    </article>
  `).join('');

  container.innerHTML = `<div class="story-list">${storyList}</div>`;

  document.querySelectorAll('.remove-bookmark-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const storyId = e.target.dataset.id;
      this.presenter.removeBookmark(storyId);
    });
  });
}


showError(message) {
  const container = document.querySelector('#bookmarked-stories');
  container.innerHTML = `<p style="color: red;">${message}</p>`;
}

  showLoading() {
    const container = document.querySelector('#bookmarked-stories');
    container.innerHTML = `<p>Loading...</p>`;
  }

  showEmpty() {
    const container = document.querySelector('#bookmarked-stories');
    container.innerHTML = `<p>Tidak ada cerita yang disimpan.</p>`;
  }

  showMessage(message) {
    alert(message);
  }
} 
