import { useMutation } from "@tanstack/react-query";
import { forgotPassword, resetPassword, verifyPasswordLink } from "../api/auth";
import { AxiosError } from "axios";

export const useForgotPassword = (
  onCustomSuccess: () => void,
  onCustomError: (err: string) => void
) => {
  const queryFn = async (email: string) => {
    const response = await forgotPassword(email);
    return response;
  };

  return useMutation({
    mutationFn: queryFn,
    onSuccess: onCustomSuccess,
    onError: (error: AxiosError<{ message: string }>) => {
      onCustomError(error.response?.data?.message ?? "Something went wrong");
    },
  });
};

export const useVerifyPasswordLink = (
  onCustomSuccess: () => void,
  onCustomError: (err: string) => void
) => {
  const queryFn = async (payload: { token: string; email: string }) => {
    const response = await verifyPasswordLink(payload.token, payload.email);
    return response;
  };

  return useMutation({
    mutationFn: queryFn,
    onSuccess: onCustomSuccess,
    onError: (error: AxiosError<{ message: string }>) => {
      onCustomError(error.response?.data?.message ?? "Something went wrong");
    },
  });
};

export const useResetPassword = (
  onCustomSuccess: () => void,
  onCustomError: (err: string) => void
) => {
  const queryFn = async (payload: {
    password: string;
    confirmPassword: string;
    token: string;
    email: string;
  }) => {
    const response = await resetPassword(
      payload.password,
      payload.confirmPassword,
      payload.token,
      payload.email
    );
    return response;
  };

  return useMutation({
    mutationFn: queryFn,
    onSuccess: onCustomSuccess,
    onError: (error: AxiosError<{ message: string }>) => {
      onCustomError(error.response?.data?.message ?? "Something went wrong");
    },
  });
};
