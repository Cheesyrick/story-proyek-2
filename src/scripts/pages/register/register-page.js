import RegisterPresenter from "../../presenter/register-presenter";

const RegisterPage = {
  async render() {
    return `
      <section class="form-section">
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <div id="register-error" class="error-message" style="display: none;"></div>

          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#/login">Login here</a></p>
      </section>
    `;
  },

  async afterRender() {
    const presenter = new RegisterPresenter(this);
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      presenter.handleRegister(name, email, password);
    });
  },

  showError(message) {
    const errorContainer = document.getElementById('register-error');
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
  },

  onRegisterSuccess() {
    alert('Registrasi berhasil! Silakan login.');
    window.location.hash = '#/login';
  }
};

export default RegisterPage;