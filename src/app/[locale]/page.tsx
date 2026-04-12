import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("Home");

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-12 p-8">
      <h1 className="font-serif text-display-1 text-yield-gold">
        {t("title")}
      </h1>
      <p className="font-sans text-body-lg text-yield-ink max-w-content text-center">
        {t("subtitle")}
      </p>

      <div className="flex gap-4 items-center">
        <Button>{t("cta")}</Button>
        <Button variant="outline">{t("learnMore")}</Button>
      </div>

      <div className="flex gap-3">
        <Badge>{t("badges.inflation")}</Badge>
        <Badge variant="secondary">{t("badges.risk")}</Badge>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-mono text-number-xl text-bull">
            {t("card.value")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-yield-ink-muted">
            {t("card.label")}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
