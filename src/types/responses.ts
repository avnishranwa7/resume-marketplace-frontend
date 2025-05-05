export interface Response<T> {
  message: string;
  data?: T;
}

export interface Order {
  id: string;
  amount: number;
  entity: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
}
