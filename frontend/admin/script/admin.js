/* admin.js – authoritative version (frontend/admin/script/admin.js) */

console.log("admin.js loaded");
console.log("API_BASE →", typeof API_BASE, API_BASE);   // should log the backend URL

const tbody    = document.querySelector("#registrations-table tbody");
const noDataEl = document.getElementById("no-data");

/* ────────────────────────────────────────────────────────────
   Load registrations and render table
────────────────────────────────────────────────────────────── */
async function loadRegistrations() {
  try {
    console.log("Fetching from →", `${API_BASE}/api/registrations`);

    const res = await fetch(`${API_BASE}/api/registrations`, {
      credentials: "include"
    });

    /* sanity-check: make sure we really got JSON */
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      const text = await res.text();              // grab the HTML/error string
      console.error("Received non-JSON:", text);
      throw new Error(`Expected JSON, got: ${contentType} (HTTP ${res.status})`);
    }

    const list = await res.json();
    console.log("registrations →", list);

    /* empty list → show “No data” banner */
    if (!Array.isArray(list) || list.length === 0) {
      noDataEl.style.display = "block";
      return;
    }

    /* build rows */
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

/* ────────────────────────────────────────────────────────────
   Utility: Download table as CSV
────────────────────────────────────────────────────────────── */
function downloadCSV() {
  const rows = [["Email", "Mess", "Plan", "Registered On"]];
  tbody.querySelectorAll("tr").forEach(tr => {
    rows.push(Array.from(tr.children).map(td => `"${td.textContent.trim()}"`));
  });
  const csv  = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href: url,
    download: "Registrations.csv"
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ────────────────────────────────────────────────────────────
   Event bindings
────────────────────────────────────────────────────────────── */
document.getElementById("download-report")?.addEventListener("click", downloadCSV);

document.getElementById("change-plans")?.addEventListener("click", () => {
  window.location.href = "./change-plans.html";      // stay within /admin/
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  window.location.href = "/logout";
});

/* kick-off */
document.addEventListener("DOMContentLoaded", loadRegistrations);
