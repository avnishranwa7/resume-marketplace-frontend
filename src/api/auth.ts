import axios, { AxiosResponse } from "axios";
import baseUrl from "./baseUrl";
import { Response } from "../types/responses";
import axiosInstance from "./axiosInstance";

export async function login(email: string, password: string) {
  const response = await axios.post(`${baseUrl}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function signup(formData: any) {
  const response = await axios.put(`${baseUrl}/auth/signup`, formData);
  return response.data;
}

export async function forgotPassword(
  email: string
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.post("/auth/forgot-password", { email });
}

export async function verifyPasswordLink(
  token: string,
  email: string
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.post("/auth/verify-password-link", {
    token,
    email,
  });
}

export async function resetPassword(
  password: string,
  confirmPassword: string,
  token: string,
  email: string
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.post("/auth/reset-password", {
    password,
    confirmPassword,
    token,
    email,
  });
}
