import React, { createContext, useState, useCallback, useRef } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    visible: false,
    title: "",
    description: "",
    status: "info",
  });
  const timeoutRef = useRef();

  const hideNotification = useCallback(() => {
    setNotification((n) => ({ ...n, visible: false }));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const showNotification = useCallback(({ title, description, status }) => {
    setNotification({ visible: true, title, description, status });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification((n) => ({ ...n, visible: false }));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}; 