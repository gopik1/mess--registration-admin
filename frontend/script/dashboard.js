const registerButton = document.getElementById("go-to-mess-registration");

document.addEventListener("DOMContentLoaded", () => {
  const isRegistered = localStorage.getItem("isRegistered");

  if (isRegistered === "true") {
    disableRegisterButton();
    enableUnregisterButton();
  } else {
    enableRegisterButton();
    disableUnregisterButton();
  }
});

// Register click handler
function registerHandler() {
  window.location.href = "register-mess.html";

  // Save state to localStorage
  localStorage.setItem("isRegistered", "true");

  disableRegisterButton();
  enableUnregisterButton();
}

// Function to disable the register button
function disableRegisterButton() {
  registerButton.removeEventListener("click", registerHandler);
  registerButton.classList.add("disabled");
  registerButton.style.pointerEvents = "none";
  registerButton.style.opacity = "0.5";
}

// Function to enable the register button
function enableRegisterButton() {
  registerButton.addEventListener("click", registerHandler);
  registerButton.classList.remove("disabled");
  registerButton.style.pointerEvents = "auto";
  registerButton.style.opacity = "1";
}

// Attach the register click handler initially
registerButton.addEventListener("click", registerHandler);

// // registration redirect
// registerButton
//   .getElementById("go-to-mess-registration")
//   .addEventListener("click", () => {
//     window.location.href = "register-mess.html"; // Adjust if needed
//   });

// status update
const status = document.querySelector(".status");
email = "";

// get email of user
fetch("https://mess-registration-app-backend.onrender.com/current-user", {
  method: "GET",
  credentials: "include", // important to send cookies/session info
})
  .then((response) => {
    if (!response.ok) throw new Error("Not logged in");
    return response.json();
  })
  .then((data) => {
    console.log("Logged in user email:", data.email);
    email = data.email;
    document.querySelector(".email").textContent = email;
  })
  .catch((error) => {
    console.error(error);
  });

// unregister

const unregisterDiv = document.querySelector(".unregister-button");

function unregisterHandler() {
  fetch("https://mess-registration-app-backend.onrender.com/unregister-user", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Not logged in");
      return response.json();
    })
    .then((data) => {
      document.querySelector(".status").textContent = `Not registered`;
      alert(data.message);

      disableUnregisterButton(); // Disable unregister
      enableRegisterButton(); // Enable register

      // Remove registration state
      localStorage.removeItem("isRegistered");
    })
    .catch((error) => {
      console.error(error);
    });
}

// Attach the handler
unregisterDiv.addEventListener("click", unregisterHandler);

// Function to disable the div
function disableUnregisterButton() {
  unregisterDiv.removeEventListener("click", unregisterHandler);
  unregisterDiv.classList.add("disabled");
  unregisterDiv.style.pointerEvents = "none";
  unregisterDiv.style.opacity = "0.5";
  // unregisterDiv.textContent = "Unregistered"; // Optional: update text
}

// Function to re-enable the div (call this after user registers)
function enableUnregisterButton() {
  unregisterDiv.addEventListener("click", unregisterHandler);
  unregisterDiv.classList.remove("disabled");
  unregisterDiv.style.pointerEvents = "auto";
  unregisterDiv.style.opacity = "1";
  unregisterDiv.textContent = "Unregister"; // Optional: restore original text
}

document.addEventListener("DOMContentLoaded", async function () {
  // active week/month
  // Set current date with format like "20th May 2025"
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Add ordinal suffix to day
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const suffix = getOrdinalSuffix(day);

  // document.getElementById(
  //   "current-date"
  // ).textContent = `${day}${suffix} ${month} ${year}`;

  // Calculate and display active week
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week (Sunday)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // End of week (Saturday)

  // Format dates for week display
  const formatDate = (date) => {
    const d = date.getDate();
    const m = date.toLocaleString("default", { month: "short" });
    return `${d} ${m}`;
  };

  const activeWeek = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Calculate and display active month
  const displayMonth = currentDate.toLocaleString("default", { month: "long" });

  // fetch mess data
  try {
    const response = await fetch(
      "https://mess-registration-app-backend.onrender.com/mess_data",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.error);
      throw new Error(errorData.error || "Failed to fetch mess data");
    }

    const result = await response.json();

    let activePeriod = "";

    if (result.plan === "Weekly") {
      activePeriod = activeWeek;
    } else if (result.plan === "Monthly") {
      activePeriod = displayMonth;
    }

    document.querySelector(
      ".status"
    ).textContent = `Registered for ${result.mess}: ${result.plan} (${activePeriod})`;
    enableUnregisterButton();
  } catch (error) {
    // alert("Error: " + error.message);
    console.log("Error: " + error.message);
  }
});

// logout handler
document.querySelector(".logout").addEventListener("click", () => {
  alert("User successfully logged out");
  window.location.href = "./index.html";
});

// history button
document.querySelector(".history-container").addEventListener("click", () => {
  window.location.href = "./history.html";
});
