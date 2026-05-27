// Mock AI helpers — simulate latency and produce plausible output.
// Ready to be swapped for real OpenAI / Lovable AI Gateway calls.

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateEmail(opts: {
  recipient: string;
  subject: string;
  tone: string;
  purpose: string;
}): Promise<string> {
  await wait(900);
  const greetings: Record<string, string> = {
    Formal: `Dear ${opts.recipient || "Recipient"},`,
    Friendly: `Hi ${opts.recipient || "there"},`,
    Persuasive: `Hello ${opts.recipient || "there"},`,
    Apologetic: `Dear ${opts.recipient || "Recipient"},`,
    Confident: `Hello ${opts.recipient || "Team"},`,
  };
  const openers: Record<string, string> = {
    Formal: "I hope this message finds you well.",
    Friendly: "Hope you're having a great week!",
    Persuasive: "I wanted to share an opportunity I think you'll find compelling.",
    Apologetic: "I want to sincerely apologize for the recent inconvenience.",
    Confident: "I'm reaching out with an update I'm confident will move things forward.",
  };
  const closers: Record<string, string> = {
    Formal: "Kind regards,",
    Friendly: "Cheers,",
    Persuasive: "Looking forward to your thoughts,",
    Apologetic: "With sincere apologies,",
    Confident: "Best,",
  };
  const purpose = opts.purpose.trim() || "follow up on our recent discussion";
  return `${greetings[opts.tone] ?? greetings.Formal}

${openers[opts.tone] ?? openers.Formal}

Regarding "${opts.subject || "our conversation"}" — I'd like to ${purpose}. Based on what we've discussed, I believe the next step is to align on priorities and confirm a timeline that works for both sides.

Please let me know a convenient time for a quick sync this week, or feel free to reply directly with your thoughts. I'm happy to share any additional context that would be helpful.

${closers[opts.tone] ?? closers.Formal}
Your Name`;
}

export interface MeetingSummary {
  summary: string;
  keyDecisions: string[];
  actionItems: { task: string; owner: string; due: string }[];
  deadlines: string[];
}

export async function summarizeMeeting(notes: string): Promise<MeetingSummary> {
  await wait(1100);
  const lines = notes.split("\n").filter((l) => l.trim());
  const wordCount = notes.split(/\s+/).length;
  return {
    summary:
      `The team discussed roadmap priorities, current blockers, and upcoming launches across ${Math.max(
        1,
        Math.round(wordCount / 80),
      )} key topics. Stakeholders aligned on near-term execution and confirmed cross-functional ownership for the next sprint.`,
    keyDecisions: [
      "Prioritize the v2 onboarding flow ahead of integrations",
      "Move weekly sync to Tuesday at 10:00 AM",
      "Adopt the new design system tokens project-wide",
    ],
    actionItems: [
      { task: "Draft launch announcement", owner: "Maya", due: "Fri" },
      { task: "Finalize Q3 OKRs", owner: "Jordan", due: "Mon" },
      { task: "Audit analytics dashboards", owner: "Priya", due: "Wed" },
      { task: `Review meeting notes (${lines.length} lines)`, owner: "You", due: "Tomorrow" },
    ],
    deadlines: ["Launch readiness review — next Thursday", "Quarterly business review — end of month"],
  };
}

export interface PlannedDay {
  day: string;
  blocks: { time: string; task: string; priority: "High" | "Medium" | "Low" }[];
}

export async function planSchedule(tasks: {
  title: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}[]): Promise<{ schedule: PlannedDay[]; recommendations: string[] }> {
  await wait(1000);
  const sorted = [...tasks].sort((a, b) => {
    const p = { High: 0, Medium: 1, Low: 2 } as const;
    return p[a.priority] - p[b.priority];
  });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["09:00 – 10:30", "10:45 – 12:00", "13:30 – 15:00", "15:15 – 16:30"];
  const schedule: PlannedDay[] = days.map((day, di) => ({
    day,
    blocks: sorted.slice(di * 2, di * 2 + 2).map((t, i) => ({
      time: slots[i],
      task: t.title || "Focus block",
      priority: t.priority,
    })),
  })).filter((d) => d.blocks.length);

  return {
    schedule,
    recommendations: [
      "Front-load high-priority deep work before noon",
      "Batch shallow tasks into a single afternoon block",
      "Protect at least 90 minutes of uninterrupted focus per day",
      "Schedule a 15-min end-of-day review to plan tomorrow",
    ],
  };
}

export interface ResearchReport {
  summary: string;
  insights: string[];
  recommendations: string[];
  breakdown: string[];
}

export async function researchTopic(topic: string): Promise<ResearchReport> {
  await wait(1200);
  const t = topic.trim() || "the requested topic";
  return {
    summary: `"${t}" is a rapidly evolving area with growing adoption across enterprise teams. Recent shifts emphasize automation, measurable ROI, and integration depth over surface-level features.`,
    insights: [
      `Adoption of ${t} has accelerated 3x year-over-year in mid-market segments`,
      "Buyers prioritize integrations and time-to-value over raw feature count",
      "Successful rollouts pair tooling with explicit workflow changes",
      "Governance and data quality remain the top blockers cited by leaders",
    ],
    recommendations: [
      `Pilot ${t} with a single team before scaling`,
      "Define success metrics upfront (cycle time, quality, adoption)",
      "Invest in onboarding and templates, not just licenses",
    ],
    breakdown: [
      "Background and current landscape",
      "Key players and differentiators",
      "Common pitfalls and mitigation",
      "Outlook for the next 12 months",
    ],
  };
}

export async function chatReply(message: string): Promise<string> {
  await wait(700 + Math.random() * 600);
  const m = message.toLowerCase();
  if (m.includes("hello") || m.includes("hi")) return "Hi there! How can I help you be more productive today?";
  if (m.includes("email")) return "I can draft that. Try the Email Generator from the sidebar — pick a tone and I'll write a polished version.";
  if (m.includes("meeting")) return "Paste your notes in the Meeting Summarizer and I'll extract decisions, action items, and deadlines.";
  if (m.includes("task") || m.includes("plan")) return "Add a few tasks in the Task Planner with priorities, and I'll produce a focused weekly schedule.";
  return `Here's a thought on "${message.slice(0, 80)}": break it into the smallest next action you can ship today, then iterate. Want me to draft it out?`;
}
