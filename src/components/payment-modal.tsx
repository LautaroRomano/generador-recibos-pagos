"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Client, Payment } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon as FilePdf } from "lucide-react";

// Esquema de validación para el formulario de pago
const paymentSchema = z.object({
  clientId: z.string(),
  date: z.string(),
  amount: z.coerce
    .number()
    .positive({ message: "El monto debe ser mayor a 0" }),
  concept: z
    .string()
    .min(3, { message: "El concepto debe tener al menos 3 caracteres" }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: Omit<Payment, "id">) => void;
  client: Client | null;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSavePayment,
  client,
}: PaymentModalProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      concept: "",
    },
  });

  // Actualizar el formulario cuando cambia el cliente seleccionado
  useEffect(() => {
    if (client) {
      form.setValue("clientId", client.id);
    }
  }, [client, form]);

  const onSubmit = (data: PaymentFormValues) => {
    onSavePayment(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
        </DialogHeader>

        {client && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-md mb-4">
                <p className="font-medium">Cliente: {client.fullName}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>

              <input type="hidden" {...form.register("clientId")} />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concepto</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa el concepto del pago"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <FilePdf className="h-4 w-4 mr-2" />
                  Generar recibo
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
