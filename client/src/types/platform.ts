export type ProfileTone = 'teal' | 'amber' | 'rose'

export type CareStatus = 'calm' | 'watch' | 'escalate'
export type ReportStatus =
  | 'stable_context'
  | 'needs_follow_up'
  | 'attention_needed'

export type PersonProfile = {
  id: string
  name: 'Erica' | 'Lina' | 'Antonio' | 'Keyssy'
  subtitle: string
  summary: string
  tone: ProfileTone
  status: string
  reportLead: string
  assistantName: string
}

export type DocumentRecord = {
  id: string
  filename: string
  mimeType: string
  uploadedAt: string
  documentType: string
  summary: string
  keyPoints: string[]
  redFlags: string[]
  requiresHumanReview: boolean
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  attachment?: DocumentRecord
  cautionLevel?: CareStatus
  keySignals?: string[]
  nextSteps?: string[]
  pending?: boolean
}

export type SituationReport = {
  headline: string
  overallStatus: ReportStatus
  narrative: string
  conversationSummary: string
  documentSummary: string
  keySignals: string[]
  timelineHighlights: string[]
  openQuestions: string[]
  suggestedNextTopics: string[]
  cautionNotes: string[]
  requiresHumanReview: boolean
  generatedAt: string
  messageCount: number
  documentCount: number
  model?: string
  responseId?: string
}

export type PersonThreadState = {
  messages: ChatMessage[]
  documents: DocumentRecord[]
  report: SituationReport | null
  isSending: boolean
  isRefreshingReport: boolean
  error: string | null
}

export type ChatPayloadMessage = {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export type ApiChatReply = {
  assistantMessage: string
  cautionLevel: CareStatus
  keySignals: string[]
  nextSteps: string[]
  requiresHumanReview: boolean
  model: string
  responseId: string
}
