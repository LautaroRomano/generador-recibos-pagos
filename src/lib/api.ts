import { Client, Payment, Expense } from "@/types";
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export type CreateClientDTO = {
  fullName: string;
  email?: string;
  street?: string;
  lote?: string;
  phone?: string;
};

export type CreatePaymentDTO = {
  clientId: string;
  date: string;
  amount: number;
  detail: string;
  conceptType: string;
  paymentType: string;
  amountText: string;
};

export type CreateExpenseDTO = {
  description: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl?: string;
  notes?: string;
};

// Client API endpoints
export const clientApi = {
  create: async (clientData: CreateClientDTO): Promise<Client> => {
    const response = await api.post<Client>("/clients", clientData);
    return response.data;
  },
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  },
  getClientById: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },
  update: async (id: string, clientData: CreateClientDTO): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, clientData);
    return response.data;
  },
  createPayment: async (paymentData: CreatePaymentDTO): Promise<Payment> => {
    const response = await api.post<Payment>("/payments", paymentData);
    return response.data;
  },
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>("/payments");
    return response.data;
  },
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  getPaymentsByClientId: async (clientId: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments/client/${clientId}`);
    return response.data;
  },
};

// Expense API endpoints
export const expenseApi = {
  create: async (expenseData: CreateExpenseDTO): Promise<Expense> => {
    const response = await api.post<Expense>("/expenses", expenseData);
    return response.data;
  },
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<Expense[]> => {
    const response = await api.get<Expense[]>("/expenses", { params });
    return response.data;
  },
  getById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },
  update: async (id: string, expenseData: CreateExpenseDTO): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}`, expenseData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    period?: "weekly" | "monthly" | "yearly";
  }) => {
    const response = await api.get("/expenses/stats", { params });
    return response.data;
  },
};

export default api;
