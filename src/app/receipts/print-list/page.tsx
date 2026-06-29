import { Suspense } from "react";
import ViewReceiptListPdf from "@/components/print/ViewReceiptListPdf";

export default function PrintReceiptListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <p>Cargando listado...</p>
        </div>
      }
    >
      <ViewReceiptListPdf />
    </Suspense>
  );
}
