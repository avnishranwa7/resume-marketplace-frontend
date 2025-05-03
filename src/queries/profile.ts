import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, getProfiles, updateProfile } from "../api/profile";
import { checkResponseSuccess } from "./util";
import { UpdateProfileRequest } from "../types/requests";
import axiosInstance from '../api/axiosInstance';

export const useGetProfiles = (role: string) => {
    const queryFn = async () => {
        const response = await getProfiles(role);
        return checkResponseSuccess(response);
    };
    return useQuery({
        queryKey: ["profiles"],
        queryFn,
        enabled: !!role
    })
}

export const useGetProfile = (id: string, type: "id" | "userId") => {
    const queryFn = async () => {
        const response = await getProfile(id, type);
        return checkResponseSuccess(response);
    }
    
    return useQuery({
        queryKey: ["profile", id],
        queryFn,
        enabled: !!id
    })
}

export const useUpdateProfile = (onCustomSuccess: () => void) => {
    const queryFn = async (payload: UpdateProfileRequest) => {
        const response = await updateProfile(payload);
        return checkResponseSuccess(response);
    }
    
    return useMutation({
        mutationFn: queryFn,
        onSuccess: onCustomSuccess,
        onError: (error) => {
            console.error(error);
        }
    })
}

export function useUnlockProfile() {
  return useMutation({
    mutationFn: async ({ userId, profileId }: { userId: string; profileId: string }) => {
      const res = await axiosInstance.put(`/unlock-profile?id=${userId}&profileId=${profileId}`);
      return res.data.message;
    },
  });
}