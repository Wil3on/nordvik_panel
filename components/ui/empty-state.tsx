import React, { ReactNode } from "react";
import { Card } from "@nextui-org/react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-12 px-6 flex flex-col items-center justify-center text-center">
      {icon && <div className="mb-4 text-default-400">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-default-500 mb-6 max-w-md">{description}</p>
      {action}
    </Card>
  );
}
