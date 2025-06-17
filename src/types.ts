export type Client = {
  id: string;
  fullName: string;
  email: string;
  street?: string;
  lote?: string;
  phone?: string;
  lastPaymentDate?: string;
  payments?: Payment[];
};

export type Payment = {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  detail: string;
  conceptType: string;
  paymentType: string;
  amountText: string;
  client?: Client | null; 
  number: number;
  concepts: Array<{
    id: string;
    conceptType: string;
    amount: number;
    detail: string;
  }>;
};
