import { z } from 'zod'

export const conversationMessageSchema = z.object({
  id: z.string().min(1).optional(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  createdAt: z.string().optional(),
})

export const documentContextSchema = z.object({
  id: z.string().min(1).optional(),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  uploadedAt: z.string().optional(),
  documentType: z.string().min(1),
  summary: z.string().min(1),
  keyPoints: z.array(z.string()),
  redFlags: z.array(z.string()),
  requiresHumanReview: z.boolean(),
})

export const assistantChatSchema = z.object({
  assistantMessage: z.string().min(1),
  cautionLevel: z.enum(['calm', 'watch', 'escalate']),
  keySignals: z.array(z.string()),
  nextSteps: z.array(z.string()),
  requiresHumanReview: z.boolean(),
})

export const situationReportSchema = z.object({
  headline: z.string().min(1),
  overallStatus: z.enum([
    'stable_context',
    'needs_follow_up',
    'attention_needed',
  ]),
  narrative: z.string().min(1),
  conversationSummary: z.string().min(1),
  documentSummary: z.string().min(1),
  keySignals: z.array(z.string()),
  timelineHighlights: z.array(z.string()),
  openQuestions: z.array(z.string()),
  suggestedNextTopics: z.array(z.string()),
  cautionNotes: z.array(z.string()),
  requiresHumanReview: z.boolean(),
})

export type ConversationMessage = z.infer<typeof conversationMessageSchema>
export type DocumentContext = z.infer<typeof documentContextSchema>
export type AssistantChatReply = z.infer<typeof assistantChatSchema>
export type SituationReport = z.infer<typeof situationReportSchema>

export const assistantChatJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    assistantMessage: { type: 'string' },
    cautionLevel: {
      type: 'string',
      enum: ['calm', 'watch', 'escalate'],
    },
    keySignals: {
      type: 'array',
      items: { type: 'string' },
    },
    nextSteps: {
      type: 'array',
      items: { type: 'string' },
    },
    requiresHumanReview: { type: 'boolean' },
  },
  required: [
    'assistantMessage',
    'cautionLevel',
    'keySignals',
    'nextSteps',
    'requiresHumanReview',
  ],
} as const

export const situationReportJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    headline: { type: 'string' },
    overallStatus: {
      type: 'string',
      enum: ['stable_context', 'needs_follow_up', 'attention_needed'],
    },
    narrative: { type: 'string' },
    conversationSummary: { type: 'string' },
    documentSummary: { type: 'string' },
    keySignals: {
      type: 'array',
      items: { type: 'string' },
    },
    timelineHighlights: {
      type: 'array',
      items: { type: 'string' },
    },
    openQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
    suggestedNextTopics: {
      type: 'array',
      items: { type: 'string' },
    },
    cautionNotes: {
      type: 'array',
      items: { type: 'string' },
    },
    requiresHumanReview: { type: 'boolean' },
  },
  required: [
    'headline',
    'overallStatus',
    'narrative',
    'conversationSummary',
    'documentSummary',
    'keySignals',
    'timelineHighlights',
    'openQuestions',
    'suggestedNextTopics',
    'cautionNotes',
    'requiresHumanReview',
  ],
} as const
