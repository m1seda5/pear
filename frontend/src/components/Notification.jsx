import React, { useContext } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

const statusToClass = {
  success: "is-success",
  error: "is-danger",
  warning: "is-warning",
  info: "is-info",
};

const Notification = () => {
  const { notification, hideNotification } = useContext(NotificationContext);
  if (!notification.visible) return null;
  const notifClass = statusToClass[notification.status] || "is-info";
  return (
    <div className={`notification friendkit-notification ${notifClass}`} style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, minWidth: 300, maxWidth: 500 }}>
      <button className="delete" onClick={hideNotification}></button>
      <strong>{notification.title}</strong>
      {notification.description && <div>{notification.description}</div>}
    </div>
  );
};

export default Notification; 