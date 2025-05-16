import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { addNotification as apiAddNotification, getNotificationsByUserId } from "@/api/api";

export interface NotificationType {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  is_read?: boolean; // đồng bộ với json-server
}

interface NotificationContextType {
  notifications: NotificationType[];
  unreadCount: number;
  addNotification: (notification: NotificationType) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  // user_id tạm thời hardcode, bạn có thể lấy từ context auth nếu có
  const user_id = "firebase-uid-1";

  // Lấy danh sách notification từ server khi load app
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByUserId(user_id);
        setNotifications(data);
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  // Thêm notification lên server và cập nhật local
  const addNotification = async (notification: NotificationType) => {
    try {
      const saved = await apiAddNotification({ ...notification, is_read: false });
      setNotifications((prev) => [{ ...saved }, ...prev]);
    } catch (err) {
      // fallback local nếu lỗi
      setNotifications((prev) => [{ ...notification, is_read: false }, ...prev]);
    }
  };

  // Đánh dấu tất cả là đã đọc (update lên server và local)
  const markAllAsRead = async () => {
    try {
      // Gọi API PATCH từng notification (json-server không hỗ trợ bulk update)
      const updated = await Promise.all(
        notifications.map(async (n) => {
          if (!n.is_read) {
            await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/notification/${n.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ is_read: true })
            });
            return { ...n, is_read: true };
          }
          return n;
        })
      );
      setNotifications(updated);
    } catch (err) {
      // fallback local
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
