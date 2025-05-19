// File: src/scripts/presenter/bookmark-presenter.js
import BookmarkPageModel from '../model/bookmark-model';

export default class BookmarkPagePresenter {
  constructor({ view }) {
    this.view = view;
    this.model = new BookmarkPageModel();
  }

  async loadBookmarkedStories() {
    try {
      const stories = await this.model.getAllBookmarkedStories();
      if (!stories || stories.length === 0) {
        this.view.showEmpty();
        return;
      }

      this.view.showStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async removeBookmark(storyId) {
    try {
      await this.model.removeStory(storyId);
      this.view.showMessage('Cerita berhasil dihapus dari bookmark.');
      await this.loadBookmarkedStories();
    } catch (error) {
      this.view.showError('Gagal menghapus cerita: ' + error.message);
    }
  }
}
