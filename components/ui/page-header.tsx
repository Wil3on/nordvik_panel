import Link from "next/link";
import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
  backButton?: boolean;
  backHref?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  backButton = false,
  backHref = "/",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex items-start gap-4">
        {backButton && (
          <Link href={backHref}>
            <Button
              isIconOnly
              variant="light"
              aria-label="Go back"
              className="mt-0.5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <div className="text-default-500 mt-1">
              {description}
            </div>
          )}
        </div>
      </div>

      {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
    </div>
  );
}
