import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">404 Seite nicht gefunden</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Diese Seite existiert nicht. Nutze die Navigation, um zu einem anderen Bereich zu wechseln.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
