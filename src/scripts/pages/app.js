// File: src/scripts/app.js
import routes from "../routes/routes";
import logout from "../utils/logout.js";
import { getActiveRoute } from "../routes/url-parser";
import { shouldSkipToContent, clearSkipFlag } from "../index.js";
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from "../template.js";
import { isServiceWorkerAvailable } from "../utils/index.js";
import { setupPushButtonUI } from '../utils/notification-helper';

function supportsViewTransition() {
  return typeof document.startViewTransition === "function";
}

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async #setupPushNotification() {
    await setupPushButtonUI('push-notification-tools');
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (
      this.#currentPage &&
      typeof this.#currentPage.stopCamera === "function"
    ) {
      this.#currentPage.stopCamera();
    }

    const renderContent = async () => {
      this.#content.classList.add("transition-view-exit");
      await new Promise(resolve => setTimeout(resolve, 300));
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      this.#currentPage = page;

      if (
        this.#currentPage &&
        typeof this.#currentPage.startCamera === "function"
      ) {
        this.#currentPage.startCamera();
      }

      this._setupAuthUI();

      if (shouldSkipToContent()) {
        this.#content.setAttribute("tabindex", "-1");
        this.#content.focus();
        this.#content.scrollIntoView();
        clearSkipFlag();
      }

      this.#content.classList.add("transition-view-enter");
      setTimeout(() => {
        this.#content.classList.remove("transition-view-enter");
        this.#content.classList.remove("transition-view-exit");
      }, 300);
    };

    if (supportsViewTransition()) {
      await document.startViewTransition(renderContent).finished;
    } else {
      this.#content.classList.add("transition-leave");
      await new Promise(resolve => setTimeout(resolve, 300));
      this.#content.classList.remove("transition-leave");
      await renderContent();
      this.#content.classList.add("transition-enter");
      setTimeout(() => {
        this.#content.classList.remove("transition-enter");
      }, 300);
    }

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
  }

  _setupAuthUI() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector('a[href="#/login"]');
    const registerLink = document.querySelector('a[href="#/register"]');
    const logoutLink = document.getElementById("logout-link");

    if (token) {
      if (loginLink) loginLink.parentElement.style.display = "none";
      if (registerLink) registerLink.parentElement.style.display = "none";
      if (logoutLink) logoutLink.parentElement.style.display = "list-item";
    } else {
      if (loginLink) loginLink.parentElement.style.display = "list-item";
      if (registerLink) registerLink.parentElement.style.display = "list-item";
      if (logoutLink) logoutLink.parentElement.style.display = "none";
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  }
}

export default App;
