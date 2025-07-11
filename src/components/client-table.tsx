"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Search, Pencil } from "lucide-react";
import type { Client } from "@/types";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientTableProps {
  clients: Client[];
  onRegisterPayment: (clientId: string) => void;
  onEditClient: (client: Client) => void;
}

export default function ClientTable({
  clients,
  onRegisterPayment,
  onEditClient,
}: ClientTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(searchLower) ||
      (client.email?.toLowerCase().includes(searchLower) ?? false) ||
      (client.lote?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Último pago</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchQuery
                    ? "No se encontraron clientes"
                    : "No hay clientes registrados"}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.fullName}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.lote || "-"}</TableCell>
                  <TableCell>
                    {client.lastPaymentDate
                      ? format(new Date(client.lastPaymentDate), "PPP", { locale: es })
                      : "Sin pagos"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClient(client)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRegisterPayment(client.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Registrar pago
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
