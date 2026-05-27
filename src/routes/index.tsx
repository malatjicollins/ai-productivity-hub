import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarCheck,
  Sparkles,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Worksmith AI" },
      { name: "description", content: "Your AI-powered productivity command center." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Tasks completed", value: "128", delta: "+18%", icon: CheckCircle2 },
  { label: "AI generations", value: "1,204", delta: "+32%", icon: Zap },
  { label: "Hours saved", value: "47h", delta: "+12%", icon: Clock },
  { label: "Productivity score", value: "92", delta: "+5", icon: TrendingUp },
];

const usageData = [
  { day: "Mon", generations: 32 },
  { day: "Tue", generations: 48 },
  { day: "Wed", generations: 61 },
  { day: "Thu", generations: 52 },
  { day: "Fri", generations: 78 },
  { day: "Sat", generations: 24 },
  { day: "Sun", generations: 18 },
];

const featureUsage = [
  { name: "Emails", count: 42 },
  { name: "Meetings", count: 28 },
  { name: "Tasks", count: 36 },
  { name: "Research", count: 19 },
  { name: "Chat", count: 64 },
];

const quickActions = [
  { title: "Draft an email", to: "/email", icon: Mail, color: "from-violet-500 to-fuchsia-500" },
  { title: "Summarize meeting", to: "/meetings", icon: FileText, color: "from-sky-500 to-cyan-500" },
  { title: "Plan my week", to: "/tasks", icon: CalendarCheck, color: "from-emerald-500 to-teal-500" },
  { title: "Research a topic", to: "/research", icon: Sparkles, color: "from-amber-500 to-orange-500" },
];

const recentActivity = [
  { kind: "Email", title: "Drafted follow-up to Acme Corp", time: "2m ago", icon: Mail },
  { kind: "Meeting", title: "Summarized Q3 planning notes", time: "1h ago", icon: FileText },
  { kind: "Task", title: "Generated weekly schedule", time: "3h ago", icon: CalendarCheck },
  { kind: "Research", title: "Analyzed competitor landscape", time: "Yesterday", icon: Sparkles },
  { kind: "Chat", title: "Brainstormed launch tagline", time: "Yesterday", icon: MessageSquare },
];

const upcoming = [
  { title: "Finalize Q3 OKRs", due: "Today", priority: "High" },
  { title: "Review launch copy", due: "Tomorrow", priority: "High" },
  { title: "Sync with design team", due: "Wed", priority: "Medium" },
  { title: "Refresh onboarding deck", due: "Fri", priority: "Low" },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Welcome */}
      <section className="overflow-hidden rounded-2xl border bg-card p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3">Good morning</Badge>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back, <span className="text-gradient">Alex</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              You have 4 tasks due today and 3 unread AI summaries. Let's make it a focused day.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-gradient-primary shadow-elegant hover:opacity-95">
              <Link to="/chatbot"><MessageSquare className="mr-2 h-4 w-4" />Ask AI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/tasks">View plan<ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft transition hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
              <p className="mt-1 text-xs text-success">{s.delta} vs last week</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle>AI usage this week</CardTitle>
            <CardDescription>Generations per day across all tools</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Area type="monotone" dataKey="generations" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Tool breakdown</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((q) => (
            <Link key={q.to} to={q.to} className="group">
              <Card className="h-full overflow-hidden shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
                <CardContent className="p-5">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${q.color} text-white shadow-elegant`}>
                    <q.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{q.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity + Upcoming */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent AI activity</CardTitle>
            <CardDescription>Your latest generations across the workspace</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {recentActivity.map((a) => (
              <div key={a.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.kind}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Upcoming tasks</CardTitle>
            <CardDescription>Next on your plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.map((t) => (
              <div key={t.title} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <Badge
                    variant={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {t.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Due {t.due}</span>
                </div>
                <Progress value={t.priority === "High" ? 80 : t.priority === "Medium" ? 50 : 25} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <AiDisclaimer />
    </div>
  );
}
