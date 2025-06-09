"use client";

import { useState } from "react";
import ClientForm from "./client-form";
import ClientTable from "./client-table";
import PaymentModal from "./payment-modal";
import EditClientModal from "./edit-client-modal";
import { toast } from "sonner";
import { clientApi } from "@/lib/api";
import { Client, Payment } from "@/types";
import { useEffect } from "react";

export default function ClientManagement() {
  // Estado para clientes y pagos
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const getClients = async () => {
    const clients = await clientApi.getAll();
    setClients(clients);
  };

  useEffect(() => {
    getClients();
  }, []);

  // Función para agregar un nuevo cliente
  const handleAddClient = async (client: Omit<Client, "id">) => {
    try {
      const newClient = await clientApi.create(client);
      setClients([...clients, newClient]);
      toast.success(`${client.fullName} ha sido agregado correctamente.`);
    } catch (error) {
      toast.error(
        "Error al agregar el cliente. Por favor, intente nuevamente."
      );
      console.error("Error creating client:", error);
    }
  };

  // Función para editar un cliente
  const handleEditClient = async (client: Omit<Client, "id">) => {
    if (!selectedClient) return;

    try {
      const updatedClient = await clientApi.update(selectedClient.id, client);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      setIsEditModalOpen(false);
      toast.success(`${client.fullName} ha sido actualizado correctamente.`);
    } catch (error) {
      toast.error(
        "Error al actualizar el cliente. Por favor, intente nuevamente."
      );
      console.error("Error updating client:", error);
    }
  };

  // Función para registrar un pago
  const handleRegisterPayment = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsPaymentModalOpen(true);
    }
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  // Función para guardar un nuevo pago
  const handleSavePayment = async (payment: Omit<Payment, "id">) => {
    const newPayment = await clientApi.createPayment(payment);
    setPayments([...payments, newPayment]);
    setIsPaymentModalOpen(false);
    toast.success("El pago ha sido registrado correctamente.");
  };

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Clientes</h2>
        <ClientForm onAddClient={handleAddClient} />

        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">Listado de Clientes</h3>
          <ClientTable
            clients={clients}
            onRegisterPayment={handleRegisterPayment}
            onEditClient={handleOpenEditModal}
          />
        </div>
      </section>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSavePayment={handleSavePayment}
        client={selectedClient}
      />

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditClient}
        client={selectedClient}
      />
    </div>
  );
}
