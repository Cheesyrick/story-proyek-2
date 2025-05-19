import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default class HomePage {
  constructor(presenter) {
    this.presenter = presenter;
    this.presenter.view = this;
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <div id="stories-list">Loading...</div>
        <div id="map" style="height: 400px; margin-top: 2rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.presenter.loadStories();
  }

  showStories(stories) {
    const container = document.querySelector("#stories-list");
    container.innerHTML = "";

    if (!stories || stories.length === 0) {
      container.innerHTML = "<p>No stories available</p>";
      return;
    }

    stories.forEach((story) => {
      const item = document.createElement("article");
      item.classList.add("story-item");
      item.innerHTML = `
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" alt="${story.description}" width="250" />
        <p><strong>Deskripsi:</strong> ${story.description}</p>
        <p><strong>Tanggal:</strong> ${new Date(story.createdAt).toLocaleDateString()}</p>
        <p><strong>Koordinat:</strong> ${story.lat}, ${story.lon}</p>
      `;
      container.appendChild(item);
    });

    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  showError(message) {
    const container = document.querySelector("#stories-list");
    container.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}
