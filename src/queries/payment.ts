import { useMutation } from "@tanstack/react-query";

import { checkResponseSuccess } from "./util";
import { makePayment } from "../api/payment";
import { Order } from "../types/responses";
import useAppSelector from "../hooks/useAppSelector";

export const useMakePayment = (
  onCustomSuccess: (data: Order | undefined) => void
) => {
  const auth = useAppSelector((state) => state.auth);

  const queryFn = async (payload: { amount: number; contactCount: number }) => {
    const response = await makePayment(payload.amount, payload.contactCount, auth.userId ?? "");
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
