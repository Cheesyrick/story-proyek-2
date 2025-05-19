import Database from "../data/database.js";

export default class BookmarkPageModel {
  async getAllBookmarkedStories() {
    try {
      return await Database.getAllStories();
    } catch (error) {
      throw new Error("Gagal mengambil cerita tersimpan");
    }
  }

  async removeStory(id) {
    try {
      await Database.deleteStory(id);
    } catch (error) {
      throw new Error("Gagal menghapus cerita");
    }
  }

  async isStoryBookmarked(id) {
    try {
      const story = await Database.getStoryById(id);
      return !!story;
    } catch (error) {
      return false;
    }
  }
}
