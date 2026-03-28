import { ReactNode } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-border border-dashed">
      <div className="bg-primary/5 p-4 rounded-full mb-4 text-primary">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-display font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
