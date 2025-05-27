// log in redirect
document.querySelector(".signup-container").addEventListener("click", () => {
  window.location.href = "./index.html";
});

// form submission handler
document
  .getElementById("student-login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload on form submit

    const email = document.getElementById("email").value;

    // Email domain check
    if (!email.endsWith("@iith.ac.in")) {
      alert("Invalid email (only @iith.ac.in allowed)");
      window.location.reload(); // Reload to reset form and stay on same page
      return; // Stop further processing
    }

    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://mess-registration-app-backend.onrender.com/signup",
        {
          // Your Flask backend URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Send as JSON
        }
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        alert(result.message); // Successful signup
        window.location.href = "./index.html"; // Redirect to login
      } else {
        alert(result.message); // Show error message
        window.location.href = "./index.html";
      }
    } catch (error) {
      alert("Error connecting to server");
      console.error(error);
    }
  });
