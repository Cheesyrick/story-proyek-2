import HomePageModel from "../model/home-page-model";

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
}