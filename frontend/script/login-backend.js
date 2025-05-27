// create account redirect
document.querySelector(".signup-container").addEventListener("click", () => {
  window.location.href = "./signup.html";
});

// form submission handler
document
  .getElementById("student-login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload on form submit

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://mess-registration-app-backend.onrender.com/login",
        {
          // Your Flask backend URL
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Send as JSON
        }
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        alert(result.message); // Successful login
        window.location.href = "./dashboard.html"; // Redirect to dashboard (change if needed)
      } else {
        alert(result.message); // Show error message
      }
    } catch (error) {
      alert("Error connecting to server");
      console.error(error);
    }
  });
