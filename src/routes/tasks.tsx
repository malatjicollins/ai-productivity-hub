import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Plus, Trash2, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { planSchedule, type PlannedDay } from "@/lib/mock-ai";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Worksmith AI" },
      { name: "description", content: "AI-powered task planner that builds your day or week." },
    ],
  }),
  component: TasksPage,
});

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

const priorityVariant = {
  High: "destructive",
  Medium: "default",
  Low: "secondary",
} as const;

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Finalize launch copy", deadline: "Today", priority: "High" },
    { id: "2", title: "Review design system tokens", deadline: "Tomorrow", priority: "Medium" },
    { id: "3", title: "Schedule 1:1s", deadline: "This week", priority: "Low" },
  ]);
  const [schedule, setSchedule] = useState<PlannedDay[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addTask = () => setTasks((t) => [...t, { id: crypto.randomUUID(), title: "", deadline: "", priority: "Medium" }]);
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeTask = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await planSchedule(tasks.filter((t) => t.title.trim()));
      setSchedule(result.schedule);
      setRecommendations(result.recommendations);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="AI Task Planner"
        description="Add your tasks, set priorities, and get a smart weekly schedule with productivity tips."
        icon={<CalendarCheck className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Your tasks</CardTitle>
              <CardDescription>{tasks.length} item{tasks.length !== 1 ? "s" : ""}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addTask}><Plus className="mr-1 h-3.5 w-3.5" />Add</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="space-y-2 rounded-lg border bg-card p-3">
                <Input
                  placeholder="Task title"
                  value={t.title}
                  onChange={(e) => updateTask(t.id, { title: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Deadline (e.g. Fri)"
                    value={t.deadline}
                    onChange={(e) => updateTask(t.id, { deadline: e.target.value })}
                    className="flex-1"
                  />
                  <Select value={t.priority} onValueChange={(v) => updateTask(t.id, { priority: v as Task["priority"] })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeTask(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-primary shadow-elegant hover:opacity-95">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Planning…</> : <><Sparkles className="mr-2 h-4 w-4" />Generate schedule</>}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>AI-generated weekly schedule</CardTitle>
              <CardDescription>Optimized by priority and focus blocks</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : schedule.length === 0 ? (
                <p className="text-sm text-muted-foreground">Add some tasks and click "Generate schedule" to see your plan.</p>
              ) : (
                <div className="space-y-4">
                  {schedule.map((day) => (
                    <div key={day.day}>
                      <h3 className="mb-2 text-sm font-semibold">{day.day}</h3>
                      <div className="space-y-2">
                        {day.blocks.map((b, i) => (
                          <div key={i} className="flex items-center justify-between rounded-md border bg-card p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground">{b.time}</span>
                              <span className="text-sm font-medium">{b.task}</span>
                            </div>
                            <Badge variant={priorityVariant[b.priority]}>{b.priority}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {recommendations.length > 0 && (
            <Card className="border-primary/30 bg-accent/30 shadow-soft">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Lightbulb className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Productivity tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {recommendations.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">→</span>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
