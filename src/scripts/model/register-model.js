export async function register({ name, email, password }) {
  const response = await fetch("https://story-api.dicoding.dev/v1/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registrasi gagal");
  }

  return data;
}