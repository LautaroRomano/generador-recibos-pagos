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
  conceptType: z.enum(["Mantenimiento", "Sociedad", "Expensa extraordinaria", "Otros"]),
  detail: z
    .string()
    .min(3, { message: "El detalle debe tener al menos 3 caracteres" }),
  paymentType: z.enum(["Efectivo", "Transferencia", "Débito", "Crédito"]),
  amountText: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: Omit<Payment, "id">) => Promise<Payment>;
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
      conceptType: "Mantenimiento",
      detail: "",
      paymentType: "Transferencia",
      amountText: "",
    },
  });

  // Actualizar el formulario cuando cambia el cliente seleccionado
  useEffect(() => {
    if (client) {
      form.setValue("clientId", client.id);
    }
  }, [client, form]);

  const onSubmit = async (data: PaymentFormValues) => {
    // Llamar a la función para guardar el pago
    const payment = await onSavePayment({
      ...data,
      number: 0,
      amountText: data.amountText || "",
    });
    
    // Resetear el formulario
    form.reset();
    
    // Abrir la ventana de impresión en una nueva pestaña
    if (payment && payment.id) {
      window.open(`/receipts/print/${payment.id}`, '_blank');
    }
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
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pago</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conceptType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de concepto</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Sociedad">Sociedad</option>
                        <option value="Expensa extraordinaria">Expensa extraordinaria</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del pago"
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
