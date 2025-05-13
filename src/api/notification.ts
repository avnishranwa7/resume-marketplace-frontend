import { AxiosResponse } from "axios";
import { Notification, Response } from "../types/responses";
import axiosInstance from "./axiosInstance";

export async function getNotifications(userId: string): Promise<AxiosResponse<Response<Array<Notification>>>> {
    return axiosInstance.get(`/notifications?id=${userId}`);
}

export async function markNotificationsAsSeen(notificationIds: Array<string>): Promise<AxiosResponse<Response<any>>> {
    return axiosInstance.post("/read-notifications", {
        notifications: notificationIds
    });
}