// src/components/LogoutConfirmModal.jsx
import React from "react";

export default function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <h2 className="logout-title">Are you sure?</h2>
        <p className="logout-subtitle">Do you really want to logout?</p>

        <div className="logout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn-logout" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
