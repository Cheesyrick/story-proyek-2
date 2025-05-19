class AddStoryModel {
  constructor() {
    this.baseUrl = "https://story-api.dicoding.dev/v1/stories";
  }

  async submitStory({ description, photo, lat, lon }) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append("lat", lat);
    formData.append("lon", lon);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan cerita");
      }

      return result;
    } catch (error) {
      throw new Error(error.message || "Terjadi kesalahan pada koneksi");
    }
  }
}

export default AddStoryModel;
