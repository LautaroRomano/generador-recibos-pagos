import ClientManagement from "@/components/client-management"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Sistema de Gestión de Pagos</h1>
      <ClientManagement />
    </div>
  )
}
