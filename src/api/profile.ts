import { AxiosResponse } from "axios";
import { ProfileData } from "../types";
import { Response } from "../types/responses";
import axiosInstance from "./axiosInstance";
import { UpdateProfileRequest } from "../types/requests";

export async function getProfiles(
  role: string,
  experience: number,
  immediatelyAvailable: boolean,
  noticePeriod: number
): Promise<AxiosResponse<Response<Array<ProfileData>>>> {
  return axiosInstance.get(
    `/profiles?role=${role}&experience=${experience}&immediatelyAvailable=${immediatelyAvailable}&noticePeriod=${noticePeriod}`
  );
}

export async function updateProfile(
  payload: UpdateProfileRequest
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.put("/profile", payload);
}

export async function getProfile(
  id: string,
  type: "id" | "userId"
): Promise<AxiosResponse<Response<ProfileData>>> {
  return axiosInstance.get(`/profile?${type}=${id}`);
}

export async function getAvailableContacts(
  id: string
): Promise<AxiosResponse<Response<number>>> {
  return axiosInstance.get(`/available-contacts?id=${id}`);
}
