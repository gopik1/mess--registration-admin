/* admin.js  –  single authoritative version */
console.log("admin.js loaded");

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5050"    // 👈 exact host + port where Flask runs
    : "https://mess-registration-api.fly.dev";   // <- prod URL

const tbody    = document.querySelector("#registrations-table tbody");
const noDataEl = document.getElementById("no-data");

async function loadRegistrations() {
  try {
    const res = await fetch(`${API_BASE}/api/registrations`, {
      credentials: "include"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    console.log("registrations →", list);

    if (!Array.isArray(list) || list.length === 0) {
      noDataEl.style.display = "block";
      return;
    }

    list.forEach(rec => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rec.email ?? "-"}</td>
        <td>${rec.mess  ?? "-"}</td>
        <td>${rec.plan  ?? "-"}</td>
        <td>${new Date(rec.registeredOn ?? Date.now()).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    noDataEl.textContent = "Error loading registrations.";
    noDataEl.style.display = "block";
  }
}

function downloadCSV() {
  const rows = [["Email", "Mess", "Plan", "Registered On"]];
  tbody.querySelectorAll("tr").forEach(tr => {
    rows.push(Array.from(tr.children).map(td => `"${td.textContent.trim()}"`));
  });
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "Registrations.csv"
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("download-report")?.addEventListener("click", downloadCSV);
document.getElementById("change-plans")?.addEventListener("click", () => {
  // load relative page, not absolute
  window.location.href = "change-plans.html";
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  window.location.href = "/logout";
});

document.addEventListener("DOMContentLoaded", loadRegistrations);
/* admin.js … keep everything else the same */
document.getElementById("change-plans")?.addEventListener("click", () => {
  // “./” forces a link that is relative to /admin/
  window.location.href = "./change-plans.html";
});

