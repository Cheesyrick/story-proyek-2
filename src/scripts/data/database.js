import { openDB } from "idb";

const DATABASE_NAME = "story-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "bookmarked-stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
  },
});

const Database = {
  async putStory(story) {
    if (!Object.prototype.hasOwnProperty.call(story, "id")) {
      throw new Error("Story object must have an `id` property");
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async getStoryById(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default Database;
