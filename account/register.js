export async function registerUser(name, email, password) {
  console.log("Register function called");
  const apiUrl = "https://v2.api.noroff.dev/auth/register";

  const userDetails = {
    name: name,
    email: email,
    password: password,
  };

  try {
    console.log("Payload sent to API:", userDetails);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("User registered successfully:", data);
    return data;
  } catch (error) {
    console.error("Error during registration", error);
  }
}
