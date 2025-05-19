// File: src/scripts/presenter/add-story-presenter.js
import AddStoryModel from "../model/add-story-model.js";
import { isCurrentPushSubscriptionAvailable } from "../utils/notification-helper.js";

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AddStoryModel();
  }

  async handleSubmit(description, photo, lat, lon) {
    try {
      const result = await this.model.submitStory({
        description,
        photo,
        lat,
        lon,
      });

      await this.notifyUser(description);
      this.view.onSubmitSuccess(result);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async notifyUser(description) {
    try {
      const isSubscribed = await isCurrentPushSubscriptionAvailable();
      if (!isSubscribed) return;

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Story berhasil dibuat", {
        body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
      });
    } catch (error) {
      console.error("notifyUser error:", error);
    }
  }
}

export default AddStoryPresenter;
