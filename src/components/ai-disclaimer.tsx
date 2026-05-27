import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        AI-generated responses may contain inaccuracies. Verify important information before use and avoid
        sharing sensitive or confidential information.
      </p>
    </div>
  );
}
