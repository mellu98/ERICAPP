export type Tone = 'teal' | 'amber' | 'rose'

export type Metric = {
  label: string
  value: string
  tone: Tone
}

export type WorkspaceCard = {
  label: string
  value: string
  note: string
  tone: Tone
}

export type DocumentItem = {
  title: string
  kind: string
  date: string
}

export type ChatSnapshot = {
  assistantName: string
  status: string
  latestMessage: string
  nextAction: string
}

export type TimelineEntry = {
  time: string
  title: string
  note: string
}

export type PlatformSection = {
  id: string
  name: string
  subtitle: string
  status: string
  statusTone: Tone
  lastUpdate: string
  summary: string
  nextStep: string
  observation: string
  metrics: Metric[]
  workspaces: WorkspaceCard[]
  documents: DocumentItem[]
  chat: ChatSnapshot
  timeline: TimelineEntry[]
}

export type PersonSection = PlatformSection

export type SpecialistAssistant = {
  name: string
  eyebrow: string
  focus?: string
  role: string
  asks: string
  limit: string
  guardrail?: string
  handoff: string
  messages: Record<string, string>
}

export type AssistantSpecialist = SpecialistAssistant

export type PlatformSummary = {
  sectionCount: number
  alertCount: number
  parserStatus: string
  installStatus: string
}
