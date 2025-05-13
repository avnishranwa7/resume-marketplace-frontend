import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../../types/responses";

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Notification>
    ) => {
      const newNotification: Notification = action.payload;
      state.notifications.unshift(newNotification);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.seen = true;
        localStorage.setItem(
          "notifications",
          JSON.stringify(state.notifications)
        );
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.seen = true;
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
}) => state.notifications.notifications.filter((n) => !n.seen).length;

export default notificationsSlice.reducer;
