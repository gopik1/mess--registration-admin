document.addEventListener("DOMContentLoaded", function () {
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

  document.getElementById(
    "current-date"
  ).textContent = `${day}${suffix} ${month} ${year}`;

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
  document.getElementById("active-week").textContent = activeWeek;

  // Calculate and display active month
  const displayMonth = currentDate.toLocaleString("default", { month: "long" });
  document.getElementById(
    "active-month"
  ).textContent = `${displayMonth} ${year}`;

  // form submission handler
  document
    .getElementById("registration-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const messTypeInput = document.querySelector(
        'input[name="mess-type"]:checked'
      );
      const planTypeInput = document.querySelector(
        'input[name="plan-type"]:checked'
      );

      if (!messTypeInput || !planTypeInput) {
        alert("Please select both mess type and plan type.");
        return;
      }

      const messType = messTypeInput.value;
      const planType = planTypeInput.value;

      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      try {
        const response = await fetch(
          "https://mess-registration-app-backend.onrender.com/register-mess",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mess: messType, plan: planType }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          // sessionStorage.setItem("messType", messType);
          // sessionStorage.setItem("planType", planType);
          window.location.href = "dashboard.html";
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        alert("Network error: " + error.message);
      } finally {
        submitButton.disabled = false;
      }
    });
});
