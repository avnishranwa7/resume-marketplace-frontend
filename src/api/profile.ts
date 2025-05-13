import { AxiosResponse } from "axios";
import { ProfileData } from "../types";
import {
  ParsedJD,
  ParsedResume,
  ProfileAccess,
  Response,
} from "../types/responses";
import axiosInstance from "./axiosInstance";
import { UpdateProfileRequest } from "../types/requests";

export async function getProfiles(
  role: string,
  experience: number,
  immediatelyAvailable: boolean,
  noticePeriod: number,
  keywords: string
): Promise<AxiosResponse<Response<Array<ProfileData>>>> {
  return axiosInstance.get(
    `/profiles?role=${role}&experience=${experience}&immediatelyAvailable=${immediatelyAvailable}&noticePeriod=${noticePeriod}&keywords=${keywords}`
  );
}

export async function updateProfile(
  payload: UpdateProfileRequest
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.put("/profile", payload);
}

export async function getProfile(
  id: string,
  type: "id" | "userId",
  role: string,
  userId: string
): Promise<AxiosResponse<Response<ProfileData>>> {
  const from = role === "job_seeker" ? undefined : userId;
  return axiosInstance.get(`/profile?${type}=${id}&from=${from}`);
}

export async function getAvailableContacts(
  id: string
): Promise<AxiosResponse<Response<number>>> {
  return axiosInstance.get(`/available-contacts?id=${id}`);
}

export async function parseResume(
  fileId: string
): Promise<AxiosResponse<Response<ParsedResume>>> {
  return axiosInstance.post("/parse-resume", { fileId });
}

export async function parseJD(
  jdText: string
): Promise<AxiosResponse<Response<ParsedJD>>> {
  return axiosInstance.post("/parse-jd", { jdText });
}

export async function hasAccess(
  userId: string,
  profileId: string
): Promise<AxiosResponse<Response<ProfileAccess>>> {
  return axiosInstance.get(
    `/profile-access?id=${userId}&profileId=${profileId}`
  );
}
