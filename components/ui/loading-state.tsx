import { Card, Spinner } from "@nextui-org/react";

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="p-8 flex flex-col items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-default-500">Loading...</p>
      </Card>
    </div>
  );
}
