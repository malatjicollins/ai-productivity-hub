import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Copy, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import { generateEmail } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Worksmith AI" },
      { name: "description", content: "Generate professional emails with AI in any tone." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive", "Apologetic", "Confident"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Formal");
  const [purpose, setPurpose] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateEmail({ recipient, subject, tone, purpose });
      setOutput(text);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Smart Email Generator"
        description="Craft polished emails in seconds. Pick a tone, describe the purpose, and let AI draft it."
        icon={<Mail className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Compose</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="e.g. Jordan Lee" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g. Project kickoff next week" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Message purpose</Label>
              <Textarea
                id="purpose"
                rows={5}
                placeholder="What's this email about? Add any context, key points, or requests."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-primary shadow-elegant hover:opacity-95">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</> : <><Sparkles className="mr-2 h-4 w-4" />Generate email</>}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>AI draft</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
              <Copy className="mr-2 h-3.5 w-3.5" />Copy
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Your AI-generated email will appear here. You can edit it before copying."
                rows={16}
                className="font-mono text-sm"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
