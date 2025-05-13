import { AxiosResponse } from "axios";
import { Response } from "../types/responses";
import axiosInstance from "./axiosInstance";

interface LoginResponse {
  token: string;
  role: string;
  userId: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const signupUser = async (data: any) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data: {
  token: string;
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const activateAccount = async (token: string) => {
  const response = await axiosInstance.post("/auth/activate-account", {
    token,
  });
  return response.data;
};

export const completeVerification = async (data: {
  token: string;
  otp: string;
}) => {
  const response = await axiosInstance.post(
    "/auth/complete-verification",
    data
  );
  return response.data;
};

export async function verifyPasswordLink(
  token: string,
  email: string
): Promise<AxiosResponse<Response<any>>> {
  return axiosInstance.post("/auth/verify-password-link", {
    token,
    email,
  });
}
