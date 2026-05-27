import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Sparkles, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { summarizeMeeting, type MeetingSummary } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Worksmith AI" },
      { name: "description", content: "Turn long meeting notes into summaries, decisions, and action items." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!notes.trim()) return toast.error("Paste some notes first");
    setLoading(true);
    try {
      setResult(await summarizeMeeting(notes));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `MEETING SUMMARY\n\n${result.summary}\n\nKEY DECISIONS\n${result.keyDecisions.map((d) => `• ${d}`).join("\n")}\n\nACTION ITEMS\n${result.actionItems.map((a) => `• ${a.task} — ${a.owner} (${a.due})`).join("\n")}\n\nDEADLINES\n${result.deadlines.map((d) => `• ${d}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste your raw notes — AI will extract the summary, decisions, action items, and deadlines."
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Paste your notes</CardTitle>
            <CardDescription>The more context, the better the summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={18}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste meeting notes, transcript, or bullet points here…"
              className="resize-none"
            />
            <Button onClick={handleSummarize} disabled={loading} className="w-full bg-gradient-primary shadow-elegant hover:opacity-95">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Summarizing…</> : <><Sparkles className="mr-2 h-4 w-4" />Summarize meeting</>}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>AI summary</CardTitle>
                <CardDescription>Concise overview of the conversation</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!result}>
                <Download className="mr-2 h-3.5 w-3.5" />Download
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-11/12" /><Skeleton className="h-4 w-3/4" /></div>
              ) : result ? (
                <p className="text-sm leading-relaxed">{result.summary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Your summary will appear here.</p>
              )}
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="border-primary/30 bg-accent/30 shadow-soft">
                <CardHeader><CardTitle className="text-base">Action items</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {result.actionItems.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-md border bg-card p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.task}</p>
                        <p className="text-xs text-muted-foreground">{a.owner} • due {a.due}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base">Key decisions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {result.keyDecisions.map((d, i) => (
                        <li key={i} className="flex gap-2"><span className="text-primary">•</span>{d}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base">Deadlines</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {result.deadlines.map((d, i) => (
                        <li key={i} className="flex items-start gap-2"><Clock className="mt-0.5 h-3.5 w-3.5 text-warning" />{d}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
