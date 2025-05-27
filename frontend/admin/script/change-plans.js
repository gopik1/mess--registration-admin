/* change-plans.js
 * 1. Loads all current registrations
 * 2. Lets an admin switch Mess / Plan per student
 * 3. Saves the change back to Flask (updates mess_data.json)
 * ---------------------------------------------------------- */

console.log("change-plans.js loaded");

const API_BASE = "http://127.0.0.1:5050";     // dev; replace with your prod URL

const tbody    = document.querySelector("#plans-table tbody");
const noDataEl = document.getElementById("no-data");

/* ─── 1. Load data ───────────────────────────────────────── */
async function loadTable() {
  try {
    const res = await fetch(`${API_BASE}/api/registrations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

/* ─── 2. Row builder ─────────────────────────────────────── */
function addRow(rec) {
  /**
   * rec = { email, mess, plan, registeredOn }
   * we’ll render two <select> elements + a Save button
   */
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

  /* click handler */
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

/* ─── 3. Back button ─────────────────────────────────────── */
document.getElementById("back-btn")?.addEventListener("click", () => {
  window.location.href = "./dashboard.html";
});

/* ─── 4. Init ────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", loadTable);
