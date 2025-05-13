import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  message: string;
  type: "profile_view" | "contact_access" | "message";
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "read" | "createdAt">>
    ) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(newNotification);
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
        localStorage.setItem(
          "notifications",
          JSON.stringify(state.notifications)
        );
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead } =
  notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: {
  notifications: NotificationsState;
}) => state.notifications.notifications;
export const selectUnreadCount = (state: {
  notifications: NotificationsState;
}) => state.notifications.notifications.filter((n) => !n.read).length;

export default notificationsSlice.reducer;
