let isLoggingOut = false;

const logout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  localStorage.removeItem("token");
  window.location.hash = "#/login";
  setTimeout(() => {
    alert("You have been logged out.");
    isLoggingOut = false;
  }, 100);
};

export default logout;
