import { useMutation } from "@tanstack/react-query";

import { checkResponseSuccess } from "./util";
import { makePayment } from "../api/payment";
import { Order } from "../types/responses";

export const useMakePayment = (
  onCustomSuccess: (data: Order | undefined) => void
) => {
  const queryFn = async (payload: { amount: number; contactCount: number }) => {
    const response = await makePayment(payload.amount, payload.contactCount);
    return checkResponseSuccess(response);
  };

  return useMutation({
    mutationFn: queryFn,
    onSuccess: (data) => onCustomSuccess(data),
    onError: (error) => {
      console.error(error);
    },
  });
};
