import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Search, Loader2, Lightbulb, ListChecks, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { researchTopic, type ResearchReport } from "@/lib/mock-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Worksmith AI" },
      { name: "description", content: "AI research assistant for summaries, insights, and recommendations." },
    ],
  }),
  component: ResearchPage,
});

const suggested = ["AI in product management", "Remote team collaboration", "B2B SaaS pricing strategy", "Async communication"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (q?: string) => {
    const query = q ?? topic;
    if (!query.trim()) return;
    if (q) setTopic(q);
    setLoading(true);
    try {
      setReport(await researchTopic(query));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="AI Research Assistant"
        description="Drop in a topic, paste an article, or ask a question — get a structured briefing in seconds."
        icon={<Sparkles className="h-5 w-5" />}
      />

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Research any topic, paste a URL, or ask a question…"
                className="pl-9 h-11"
              />
            </div>
            <Button onClick={() => search()} disabled={loading} className="h-11 bg-gradient-primary shadow-elegant hover:opacity-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" />Research</>}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {suggested.map((s) => (
              <button
                key={s}
                onClick={() => search(s)}
                className="rounded-full border bg-card px-3 py-1 text-xs transition hover:border-primary hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card className="shadow-soft">
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {!loading && report && (
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>AI-generated overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Lightbulb className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Key insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {report.insights.map((i, idx) => <li key={idx} className="flex gap-2"><span className="text-primary">•</span>{i}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <TrendingUp className="h-4 w-4 text-success" />
                <CardTitle className="text-base">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {report.recommendations.map((r, idx) => <li key={idx} className="flex gap-2"><span className="text-success">→</span>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <ListChecks className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Suggested breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {report.breakdown.map((b, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{idx + 1}</span>
                    {b}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      <AiDisclaimer />
    </div>
  );
}
