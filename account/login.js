export async function loginUser() {
  const url = "https://v2.api.noroff.dev/auth/login";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const credentials = { email, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (data.data.accessToken) {
      console.log("Token received:", data.data.accessToken);
      localStorage.setItem("username", data.data.name);
      return data.data.accessToken;
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

export function initializeLoginForm() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = await loginUser();
      if (token) {
        localStorage.setItem("token", token);
        alert("Login successful");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    });
  }
}
