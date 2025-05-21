import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import AddStoryPresenter from "../../presenter/add-story-presenter.js";

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const AddStoryPage = {
  cameraStream: null,
  lat: null,
  lng: null,
  presenter: null,

  async render() {
    return `
      <section id="add-story" class="add-story-page">
        <h1>Tambah Cerita</h1>
        <form id="add-story-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>
          
          <label for="photo">Foto</label>
          <input type="file" id="photo" name="photo" accept="image/*" required />
          
          <button type="button" id="capture-btn">Ambil Foto</button>
          <video id="camera" style="display: none;" width="100%" height="auto" autoplay></video>
          <canvas id="canvas" style="display: none;"></canvas>

          <div id="photo-result" style="margin-top: 1rem;">
            <p>Hasil Tangkapan Kamera:</p>
            <img id="result-photo" src="" alt="Hasil tangkapan foto" style="max-width: 100%; display: none;" />
          </div>

          <label for="map">Pilih Lokasi:</label>
          <div id="map" style="height: 300px; margin-top: 1rem;"></div>
          <div id="selected-coordinates" style="margin-top: 1rem; font-weight: bold;">
  Lokasi belum dipilih.
</div>

          <div id="form-error" class="error-message" style="display: none; color: red; margin-top: 1rem;"></div>
          
          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    this.presenter = new AddStoryPresenter(this);

    const captureBtn = document.getElementById("capture-btn");
    const camera = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const form = document.getElementById("add-story-form");
    const photoInput = document.getElementById("photo");
    const resultPhoto = document.getElementById("result-photo");

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      camera.srcObject = this.cameraStream;
      camera.style.display = "block";
    } catch (error) {
      console.error("Gagal mengakses kamera:", error);
    }

    captureBtn.addEventListener("click", () => {
      const scaleFactor = 0.3;
      const resizedWidth = camera.videoWidth * scaleFactor;
      const resizedHeight = camera.videoHeight * scaleFactor;

      canvas.width = resizedWidth;
      canvas.height = resizedHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(camera, 0, 0, resizedWidth, resizedHeight);

      const photoDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      resultPhoto.src = photoDataUrl;
      resultPhoto.style.display = "block";

      const imageBlob = this.dataURLToBlob(photoDataUrl);
      const file = new File([imageBlob], "photo.jpg", { type: "image/jpeg" });
      console.log("Ukuran file setelah resize:", file.size / 1024, "KB");
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInput.files = dataTransfer.files;

      camera.style.display = "none";
    });

    const map = L.map("map").setView([-6.2, 106.8], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;

      if (marker) marker.remove();
      marker = L.marker([this.lat, this.lng])
        .addTo(map)
        .bindPopup("Lokasi terpilih")
        .openPopup();

      const coordDisplay = document.getElementById("selected-coordinates");
      coordDisplay.textContent = `Latitude: ${this.lat.toFixed(
        5
      )}, Longitude: ${this.lng.toFixed(5)}`;
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const description = form.description.value;
      const photo = form.photo.files[0];

      if (!photo || this.lat == null || this.lng == null) {
        this.showError("Pastikan foto dan lokasi sudah dipilih!");
        return;
      }

      this.presenter.handleSubmit(description, photo, this.lat, this.lng);
    });
  },

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
    }
  },

  showError(message) {
    const errorContainer = document.getElementById("form-error");
    errorContainer.style.display = "block";
    errorContainer.textContent = message;
  },

  onSubmitSuccess() {
    alert("Cerita berhasil ditambahkan!");
    this.stopCamera();
    window.location.hash = "/";
  },

  dataURLToBlob(dataUrl) {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: mimeString });
  },
};

export default AddStoryPage;