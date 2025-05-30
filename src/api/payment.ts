import { AxiosResponse } from "axios";

import { Order, Response } from "../types/responses";
import axiosInstance from "./axiosInstance";

export async function makePayment(
  amount: number,
  contactCount: number,
  userId: string
): Promise<AxiosResponse<Response<Order>>> {
  return axiosInstance.post("/payment", {
    amount,
    contactCount,
    userId,
  });
}
