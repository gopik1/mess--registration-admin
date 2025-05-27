"""
admin-only backend (Flask)
--------------------------
Exposes just two endpoints used by the admin dashboard:

  • GET  /api/registrations
  • POST /api/update-registration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from zoneinfo import ZoneInfo
import json, os

# ─── Basic app + CORS ────────────────────────────────────────────────
app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,        # ← must be True
    origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://mess-registration-app-neon.vercel.app"
    ]
)

# ─── Files ───────────────────────────────────────────────────────────
BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
MESS_DATA_FILE  = os.path.join(BASE_DIR, "mess_data.json")

# load once at startup (will be overwritten on every update)
registrations = {}
if os.path.exists(MESS_DATA_FILE):
    with open(MESS_DATA_FILE) as f:
        registrations = json.load(f)

def save_registrations():
    with open(MESS_DATA_FILE, "w") as f:
        json.dump(registrations, f, indent=2)

def ist_now():
    return datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%dT%H:%M:%S")

# ─── GET: all registrations ──────────────────────────────────────────
@app.route("/api/registrations")
def list_registrations():
    """Return [{ email, mess, plan, registeredOn }, …]"""
    return jsonify([{**rec, "email": email} for email, rec in registrations.items()])

# ─── POST: update one record (mess / plan) ───────────────────────────
@app.route("/api/update-registration", methods=["POST"])
def update_registration():
    """
    Expects JSON: { "email": "...", "mess": "Mess A", "plan": "Weekly" }
    """
    data  = request.json or {}
    email = data.get("email")
    mess  = data.get("mess")
    plan  = data.get("plan")

    if not (email and mess and plan):
        return jsonify({"error": "email, mess, plan required"}), 400
    if email not in registrations:
        return jsonify({"error": "email not found"}), 404

    registrations[email]["mess"] = mess
    registrations[email]["plan"] = plan
    registrations[email]["registeredOn"] = ist_now()
    save_registrations()

    return jsonify({"message": "updated"}), 200

# ─── Root ────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return "Admin backend is live!"

# ─── Run ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5050)))
