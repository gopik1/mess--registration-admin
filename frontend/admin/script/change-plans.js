/* change-plans.js – authoritative version (frontend/admin/script/change-plans.js) */

console.log("change-plans.js loaded");
console.log("API_BASE →", typeof API_BASE, API_BASE);   // should be a string URL

const tbody    = document.querySelector("#plans-table tbody");
const noDataEl = document.getElementById("no-data");

/* ────────────────────────────────────────────────────────────
   1. Load data and render table
────────────────────────────────────────────────────────────── */
async function loadTable() {
  try {
    console.log("Fetching registrations →", `${API_BASE}/api/registrations`);

    const res = await fetch(`${API_BASE}/api/registrations`);
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.includes("application/json")) {
      const txt = await res.text();
      console.error("Non-JSON response:", txt);
      throw new Error(`Expected JSON, got: ${type} (HTTP ${res.status})`);
    }

    const list = await res.json();

    if (!Array.isArray(list) || list.length === 0) {
      noDataEl.style.display = "block";
      return;
    }

    list.forEach(addRow);
  } catch (err) {
    console.error(err);
    noDataEl.textContent = "Error loading registrations.";
    noDataEl.style.display = "block";
  }
}

/* ────────────────────────────────────────────────────────────
   2. Row builder
────────────────────────────────────────────────────────────── */
function addRow(rec) {
  const messOpts = ["Mess A", "Mess B"];
  const planOpts = ["Monthly", "Weekly"];

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${rec.email}</td>
    <td>
      <select class="mess-select">
        ${messOpts.map(m => `<option value="${m}" ${m === rec.mess ? "selected" : ""}>${m}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="plan-select">
        ${planOpts.map(p => `<option value="${p}" ${p === rec.plan ? "selected" : ""}>${p}</option>`).join("")}
      </select>
    </td>
    <td class="actions-cell">
      <button class="save-btn" type="button">Save</button>
      <span class="saved-msg" style="display:none; color:green;">✔</span>
    </td>
  `;

  /* save-button handler */
  tr.querySelector(".save-btn").addEventListener("click", async () => {
    const newMess = tr.querySelector(".mess-select").value;
    const newPlan = tr.querySelector(".plan-select").value;

    try {
      const res = await fetch(`${API_BASE}/api/update-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: rec.email, mess: newMess, plan: newPlan })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      /* tiny success tick */
      const btn  = tr.querySelector(".save-btn");
      const tick = tr.querySelector(".saved-msg");
      tick.style.display = "inline";
      btn.disabled = true;
      setTimeout(() => { tick.style.display = "none"; btn.disabled = false; }, 1500);
    } catch (err) {
      alert("Failed to save. Check console.");
      console.error(err);
    }
  });

  tbody.appendChild(tr);
}

/* ────────────────────────────────────────────────────────────
   3. Back button
────────────────────────────────────────────────────────────── */
document.getElementById("back-btn")?.addEventListener("click", () => {
  window.location.href = "./dashboard.html";
});

/* ────────────────────────────────────────────────────────────
   4. Init
────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", loadTable);
