import LoginPresenter from "../../presenter/login-presenter";

const LoginPage = {
  async render() {
    return `
      <section class="form-section">
        <h2>Login</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <div id="login-error" class="error-message" style="display: none;"></div>

          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a></p>
      </section>
    `;
  },

  async afterRender() {
    const presenter = new LoginPresenter(this);
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      presenter.handleLogin(email, password);
    });
  },

  showError(message) {
    const errorContainer = document.getElementById('login-error');
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
  }
};

export default LoginPage;