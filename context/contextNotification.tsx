import React, { createContext, useState, useContext } from "react";

interface PurchasedItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Notification {
  id: string;
  type: "purchase";
  items: PurchasedItem[];
  total: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
