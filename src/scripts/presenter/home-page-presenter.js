// File: src/scripts/presenter/home-page-presenter.js
import HomePageModel from "../model/home-page-model";
import Database from "../data/database";

export default class HomePagePresenter {
  constructor({ view }) {
    this.view = view;
    this.model = new HomePageModel();
  }

  async loadStories() {
    const token = localStorage.getItem("token");

    try {
      const stories = await this.model.getStories(token);
      this.view.showStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async saveStory(story) {
    try {
      await Database.putStory(story);
      this.view.showBookmarkSuccess("Cerita berhasil disimpan ke bookmark.");
    } catch (error) {
      this.view.showBookmarkFailed("Gagal menyimpan cerita.");
    }
  }
  async isStoryBookmarked(id) {
    try {
      const story = await Database.getStoryById(id);
      return !!story;
    } catch {
      return false;
    }
  }
}
