import ViewExpensePdf from "@/components/print/ViewExpensePdf";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintExpensePage({ params }: PageProps) {
  const { id } = await params;
  
  return <ViewExpensePdf id={id} />;
}
