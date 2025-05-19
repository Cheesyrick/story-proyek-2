import HomePage from "../pages/home/home-page";
import HomePagePresenter from "../presenter/home-page-presenter";
import AboutPage from "../pages/about/about-page";
import AddPage from "../pages/add/add-page"; 
import LoginPage from "../pages/login/login-page.js";
import RegisterPage from "../pages/register/register-page.js";

const homePage = new HomePage(new HomePagePresenter({ view: null }));

const routes = {
  "/": homePage,
  "/about": new AboutPage(),
  "/add": AddPage,
  "/login": LoginPage,
  "/register": RegisterPage,
};

export default routes;