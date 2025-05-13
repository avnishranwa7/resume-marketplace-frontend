import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAvailableContacts,
  getProfile,
  getProfiles,
  hasAccess,
  parseJD,
  parseResume,
  updateProfile,
} from "../api/profile";
import { checkResponseSuccess } from "./util";
import { UpdateProfileRequest } from "../types/requests";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";
import { ParsedJD, ParsedResume, Response } from "../types/responses";
import useAppSelector from "../hooks/useAppSelector";

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
    staleTime: 1 * 60 * 1000, // Data stays fresh for 1 minute
  });
};

export const useGetProfile = (id: string, type: "id" | "userId") => {
  const auth = useAppSelector((state) => state.auth);

  const queryFn = async () => {
    const response = await getProfile(
      id,
      type,
      auth.role ?? "",
      auth.userId ?? ""
    );
    return checkResponseSuccess(response);
  };

  return useQuery({
    queryKey: ["profile", id],
    queryFn,
    enabled: !!id,
    staleTime: type === "userId" ? Infinity : 0.5 * 60 * 1000,
  });
};

export const useGetAvailableContacts = (role: string) => {
  const auth = useAppSelector((state) => state.auth);

  const queryFn = async () => {
    const response = await getAvailableContacts(auth.userId ?? "");
    return checkResponseSuccess(response);
  };

  return useQuery({
    queryKey: ["available-contacts", auth.userId],
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

export const useHasAccess = (userId: string, profileId: string) => {
  const queryFn = async () => {
    const response = await hasAccess(userId, profileId);
    return checkResponseSuccess(response);
  };

  return useQuery({
    queryKey: ["has-access", userId, profileId],
    queryFn,
    enabled: !!userId && !!profileId,
  });
};
