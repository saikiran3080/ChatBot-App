import React, { useEffect } from "react";

export default function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="toast-container">
      <div className="toast-box">{message}</div>
    </div>
  );
}
