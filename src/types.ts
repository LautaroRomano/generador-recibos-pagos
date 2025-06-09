export type Client = {
  id: string;
  fullName: string;
  email: string;
  street?: string;
  lote?: string;
  phone?: string;
  lastPaymentDate?: string;
};

export type Payment = {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  concept: string;
  paymentType: string;
  amountText: string;
  client?: Client | null;
};
