"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import type { Client } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon as FilePdf, Loader2 as Loader } from "lucide-react";
import { numberToText } from "@/lib/numberToText";

// Esquema de validación para el formulario de pago
const paymentSchema = z.object({
  clientId: z.string(),
  date: z.string(),
  paymentType: z.enum(["Efectivo", "Transferencia", "Débito", "Crédito"]),
  concepts: z
    .array(
      z.object({
        conceptType: z.enum([
          "Mantenimiento",
          "Sociedad",
          "Expensa extraordinaria",
          "Otros",
        ]),
        amount: z.coerce
          .number()
          .positive({ message: "El monto debe ser mayor a 0" }),
        detail: z.string(),
      })
    )
    .min(1, { message: "Debe agregar al menos un concepto" }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (data: any) => Promise<any>;
  client: Client | null;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSavePayment,
  client,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      paymentType: "Transferencia",
      concepts: [{ conceptType: "Mantenimiento", amount: 0, detail: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "concepts",
  });

  // Actualizar el formulario cuando cambia el cliente seleccionado
  useEffect(() => {
    if (client) {
      form.setValue("clientId", client.id);
    }
  }, [client, form]);

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    // Calcular el monto total
    const totalAmount = data.concepts.reduce(
      (sum, concept) => sum + concept.amount,
      0
    );

    // Llamar a la función para guardar el pago
    const payment = await onSavePayment({
      ...data,
      amountText: numberToText(totalAmount),
    });

    // Resetear el formulario
    form.reset();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Conceptos de Pago</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        conceptType: "Mantenimiento",
                        amount: 0,
                        detail: "",
                      })
                    }
                  >
                    Agregar Concepto
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-md space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`concepts.${index}.conceptType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de concepto</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border rounded-md"
                                {...field}
                              >
                                <option value="Mantenimiento">
                                  Mantenimiento
                                </option>
                                <option value="Sociedad">Sociedad</option>
                                <option value="Expensa extraordinaria">
                                  Expensa extraordinaria
                                </option>
                                <option value="Otros">Otros</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`concepts.${index}.amount`}
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
                      name={`concepts.${index}.detail`}
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
                    <div className="flex justify-end items-center">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FilePdf className="h-4 w-4 mr-2" />
                  )}
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
