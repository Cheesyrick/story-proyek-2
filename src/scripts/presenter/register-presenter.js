import { register } from "../model/register-model.js";

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      await register({ name, email, password });
      this.view.onRegisterSuccess();
    } catch (error) {
      this.view.showError(error.message || "Terjadi kesalahan saat registrasi");
    }
  }
}

export default RegisterPresenter;