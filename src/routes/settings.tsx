import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Worksmith AI" },
      { name: "description", content: "Manage your account, preferences, and AI settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and AI behavior."
        icon={<SettingsIcon className="h-5 w-5" />}
      />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear across the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label>Name</Label><Input defaultValue="Alex Morgan" /></div>
          <div className="grid gap-2"><Label>Email</Label><Input defaultValue="alex@worksmith.ai" /></div>
          <div className="grid gap-2"><Label>Role</Label><Input defaultValue="Product Manager" /></div>
          <div className="grid gap-2"><Label>Timezone</Label><Input defaultValue="UTC-5 (New York)" /></div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Tune how the app behaves for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email notifications", desc: "Get a daily AI digest in your inbox." },
            { label: "Save AI history", desc: "Keep a searchable log of every generation." },
            { label: "Smart suggestions", desc: "Show contextual prompts across the app." },
            { label: "Reduced motion", desc: "Minimize animations across the interface." },
          ].map((p, i) => (
            <div key={p.label}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
              {i < 3 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>AI configuration</CardTitle>
          <CardDescription>Connect your own provider (mock for demo).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>OpenAI API key</Label>
            <Input type="password" placeholder="sk-…" />
            <p className="text-xs text-muted-foreground">Stored securely. Used for live AI generation when available.</p>
          </div>
          <div className="grid gap-2"><Label>Default model</Label><Input defaultValue="gpt-4o-mini" /></div>
          <div className="grid gap-2"><Label>Default tone</Label><Input defaultValue="Friendly" /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => toast.success("Settings saved")} className="bg-gradient-primary shadow-elegant hover:opacity-95">
          Save changes
        </Button>
      </div>

      <AiDisclaimer />
    </div>
  );
}
