import { login } from "../model/login-model.js";

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      await login({ email, password });
      window.location.hash = "/";
    } catch (error) {
      const message =
        error.message.includes("401") ||
        error.message.toLowerCase().includes("unauthorized")
          ? "Email atau password salah. Silakan coba lagi."
          : "Terjadi kesalahan saat login.";
      this.view.showError(message);
    }
  }
}

export default LoginPresenter;
