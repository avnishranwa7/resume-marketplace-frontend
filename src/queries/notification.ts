import { useMutation, useQuery } from "@tanstack/react-query";
import { getNotifications, markNotificationsAsSeen } from "../api/notification";
import useAppSelector from "../hooks/useAppSelector";
import { AxiosError } from "axios";

export const useGetNotifications = () => {
    const auth = useAppSelector((state) => state.auth);

    const queryFn = async () => {
        const response = await getNotifications(auth.userId ?? "");
        return response;
    };

    return useQuery({
        queryKey: ["notifications"],
        queryFn,
        enabled: auth.role === "job_seeker",
        staleTime: Infinity,
        select: (data) => {
            return data.data.data ?? []
        },
    });
};

export const useMarkNotificationsAsSeen = (
    onCustomSuccess: () => void,
    onCustomError: (error: string) => void
  ) => {

    const queryFn = async (notifications: Array<string>) => {
      const response = await markNotificationsAsSeen(notifications);
      return response;
    };
  
    return useMutation({
      mutationFn: queryFn,
      onSuccess: onCustomSuccess,
      onError: (error: AxiosError<{message: string}>) => {
        onCustomError(error.response?.data?.message ?? "An error occurred");
      },
    });
  };