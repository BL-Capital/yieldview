import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-12 p-8">
      <h1 className="font-serif text-display-1 text-yield-gold">YieldField</h1>
      <p className="font-sans text-body-lg text-yield-ink max-w-content text-center">
        Finance de marché éclairée par l&apos;IA — un briefing quotidien tenu
        par un chartiste virtuel.
      </p>

      {/* shadcn smoke test */}
      <div className="flex gap-4 items-center">
        <Button>Voir les Coulisses</Button>
        <Button variant="outline">En savoir plus</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="flex gap-3">
        <Badge>Inflation US</Badge>
        <Badge variant="secondary">Risque moyen</Badge>
        <Badge variant="destructive">VIX Alert</Badge>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-mono text-number-xl text-bull">
            +2,47%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-yield-ink-muted">
            CAC 40 — performance du jour
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
