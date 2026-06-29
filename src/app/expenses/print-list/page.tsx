import { Suspense } from "react";
import ViewExpenseListPdf from "@/components/print/ViewExpenseListPdf";

export default function PrintExpenseListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <p>Cargando listado...</p>
        </div>
      }
    >
      <ViewExpenseListPdf />
    </Suspense>
  );
}
