import { getAllStories } from "../data/api.js";

export default class HomePageModel {
  async getStories(token) {
    try {
      const data = await getAllStories(token);
      return data.listStory;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
