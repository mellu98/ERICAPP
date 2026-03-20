import type {
  ApiChatReply,
  ChatPayloadMessage,
  DocumentRecord,
  SituationReport,
} from '../types/platform'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://ericapp-parser.onrender.com')
).replace(/\/$/, '')

export type SendChatRequest = {
  profile: 'Erica' | 'Lina' | 'Antonio' | 'Keyssy'
  message: string
  history: ChatPayloadMessage[]
  documents: DocumentRecord[]
  file?: File | null
}

export type SendChatResponse = {
  assistant: ApiChatReply
  attachment: null | {
    filename: string
    mimeType: string
    size: number
    parsedDocument: {
      documentType: string
      summary: {
        plainLanguage: string
        keyPoints: string[]
      }
      redFlagsMentioned: Array<{ item: string }>
      requiresHumanReview: boolean
    }
    snapshot: Omit<DocumentRecord, 'id'>
  }
}

export async function sendProfileChat(
  payload: SendChatRequest,
): Promise<SendChatResponse> {
  const formData = new FormData()
  formData.append('profile', payload.profile)
  formData.append('message', payload.message)
  formData.append('history', JSON.stringify(payload.history))
  formData.append(
    'documents',
    JSON.stringify(
      payload.documents.map((document) => ({
        filename: document.filename,
        mimeType: document.mimeType,
        uploadedAt: document.uploadedAt,
        documentType: document.documentType,
        summary: document.summary,
        keyPoints: document.keyPoints,
        redFlags: document.redFlags,
        requiresHumanReview: document.requiresHumanReview,
      })),
    ),
  )

  if (payload.file) {
    formData.append('file', payload.file)
  }

  const response = await fetch(`${API_BASE_URL}/api/profile-chat`, {
    method: 'POST',
    body: formData,
  })

  return parseJsonResponse<SendChatResponse>(response)
}

export async function fetchSituationReport(payload: {
  profile: 'Erica' | 'Lina' | 'Antonio' | 'Keyssy'
  history: ChatPayloadMessage[]
  documents: DocumentRecord[]
}): Promise<SituationReport> {
  const response = await fetch(`${API_BASE_URL}/api/profile-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await parseJsonResponse<{ report: SituationReport }>(response)
  return data.report
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed.')
  }

  return data as T
}
