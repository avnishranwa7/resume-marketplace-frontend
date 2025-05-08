import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAvailableContacts,
  getProfile,
  getProfiles,
  parseJD,
  parseResume,
  updateProfile,
} from "../api/profile";
import { checkResponseSuccess } from "./util";
import { UpdateProfileRequest } from "../types/requests";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { ParsedJD, ParsedResume, Response } from "../types/responses";

export const useGetProfiles = (
  role: string,
  experience: number,
  immediatelyAvailable: boolean,
  noticePeriod: string,
  keywords: string
) => {
  const queryFn = async () => {
    const response = await getProfiles(
      role,
      experience,
      immediatelyAvailable,
      noticePeriod === "" ? 0 : Number(noticePeriod),
      keywords
    );
    return checkResponseSuccess(response);
  };
  return useQuery({
    queryKey: [
      "profiles",
      role,
      experience,
      immediatelyAvailable,
      noticePeriod,
      keywords,
    ],
    queryFn,
    enabled: !!role,
  });
};

export const useGetProfile = (id: string, type: "id" | "userId") => {
  const queryFn = async () => {
    const response = await getProfile(id, type);
    return checkResponseSuccess(response);
  };

  return useQuery({
    queryKey: ["profile", id],
    queryFn,
    enabled: !!id,
  });
};

export const useGetAvailableContacts = (role: string) => {
  const id = localStorage.getItem("userId");

  const queryFn = async () => {
    const response = await getAvailableContacts(id ?? "");
    return checkResponseSuccess(response);
  };

  return useQuery({
    queryKey: ["available-contacts", id],
    queryFn,
    enabled: role !== "job_seeker",
  });
};

export const useUpdateProfile = (onCustomSuccess: () => void) => {
  const queryFn = async (payload: UpdateProfileRequest) => {
    const response = await updateProfile(payload);
    return checkResponseSuccess(response);
  };

  return useMutation({
    mutationFn: queryFn,
    onSuccess: onCustomSuccess,
    onError: (error) => {
      console.error(error);
    },
  });
};

export function useUnlockProfile() {
  return useMutation({
    mutationFn: async ({
      userId,
      profileId,
    }: {
      userId: string;
      profileId: string;
    }) => {
      const res = await axiosInstance.put(
        `/unlock-profile?id=${userId}&profileId=${profileId}`
      );
      return res.data.message;
    },
  });
}

export function useParseResume(
  onCustomSuccess: (data: ParsedResume | undefined) => void,
  onCustomError: (err: string) => void
) {
  const mutationFn = async (fileId: string) => {
    const response = await parseResume(fileId);
    return checkResponseSuccess(response);
  };
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      onCustomSuccess(data);
    },
    onError: (error: AxiosError) => {
      onCustomError(
        (error.response?.data as Response<any>)?.message ?? "An error occurred"
      );
    },
  });
}

export function useParseJD(
  onCustomSuccess: (data: ParsedJD | undefined) => void,
  onCustomError: (err: string) => void
) {
  const mutationFn = async (jdText: string) => {
    const response = await parseJD(jdText);
    return checkResponseSuccess(response);
  };
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      onCustomSuccess(data);
    },
    onError: (error: AxiosError) => {
      onCustomError(
        (error.response?.data as Response<any>)?.message ?? "An error occurred"
      );
    },
  });
}
