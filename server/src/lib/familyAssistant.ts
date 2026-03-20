import { getOpenAIClient } from './openai.js'
import {
  assistantChatJsonSchema,
  assistantChatSchema,
  situationReportJsonSchema,
  situationReportSchema,
  type AssistantChatReply,
  type ConversationMessage,
  type DocumentContext,
  type SituationReport,
} from './assistantSchemas.js'

const CHAT_SYSTEM_PROMPT = `
You are an AI family health companion inside a private caregiver app.

Rules:
- Respond in Italian.
- Stay grounded only in the provided chat and uploaded-document summaries.
- Be warm, clear, and practical.
- Never diagnose, never prescribe, and never suggest changing medications or treatment.
- If the user describes potentially urgent symptoms or a document mentions concerning findings, say the situation needs human medical review and choose a higher caution level.
- Never mix information from different family profiles.
- requiresHumanReview must always be true.
`.trim()

const REPORT_SYSTEM_PROMPT = `
You create a detailed but non-diagnostic status report for one family profile.

Rules:
- Respond in Italian.
- Use only the supplied conversation history and document summaries.
- Be specific, organized, and transparent about uncertainty.
- Do not diagnose or recommend treatment changes.
- If something sounds urgent or important, frame it as needing professional review.
- requiresHumanReview must always be true.
`.trim()

export type GenerateProfileChatReplyInput = {
  profile: string
  message: string
  history: ConversationMessage[]
  documents: DocumentContext[]
  uploadedDocument?: DocumentContext
}

export type GenerateProfileChatReplyResult = {
  model: string
  responseId: string
  reply: AssistantChatReply
}

export type GenerateSituationReportInput = {
  profile: string
  history: ConversationMessage[]
  documents: DocumentContext[]
}

export type GenerateSituationReportResult = {
  model: string
  responseId: string
  report: SituationReport
}

export async function generateProfileChatReply(
  input: GenerateProfileChatReplyInput,
): Promise<GenerateProfileChatReplyResult> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_FAMILY_ASSISTANT_MODEL ??
    process.env.OPENAI_MEDICAL_PARSER_MODEL ??
    'gpt-5.4'

  const response = await client.responses.create({
    model,
    store: false,
    reasoning: {
      effort: 'medium',
    },
    text: {
      format: {
        type: 'json_schema',
        name: 'family_profile_chat_reply',
        strict: true,
        schema: assistantChatJsonSchema,
      },
    },
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: CHAT_SYSTEM_PROMPT }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: buildChatPrompt(input),
          },
        ],
      },
    ],
  })

  const outputText = response.output_text

  if (!outputText) {
    throw new Error('The family assistant returned an empty chat response.')
  }

  return {
    model,
    responseId: response.id,
    reply: {
      ...assistantChatSchema.parse(JSON.parse(outputText)),
      requiresHumanReview: true,
    },
  }
}

export async function generateSituationReport(
  input: GenerateSituationReportInput,
): Promise<GenerateSituationReportResult> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_FAMILY_ASSISTANT_MODEL ??
    process.env.OPENAI_MEDICAL_PARSER_MODEL ??
    'gpt-5.4'

  const response = await client.responses.create({
    model,
    store: false,
    reasoning: {
      effort: 'medium',
    },
    text: {
      format: {
        type: 'json_schema',
        name: 'family_profile_situation_report',
        strict: true,
        schema: situationReportJsonSchema,
      },
    },
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: REPORT_SYSTEM_PROMPT }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: buildReportPrompt(input),
          },
        ],
      },
    ],
  })

  const outputText = response.output_text

  if (!outputText) {
    throw new Error('The family assistant returned an empty report response.')
  }

  return {
    model,
    responseId: response.id,
    report: {
      ...situationReportSchema.parse(JSON.parse(outputText)),
      requiresHumanReview: true,
    },
  }
}

function buildChatPrompt(input: GenerateProfileChatReplyInput) {
  const history = input.history.length > 0
    ? input.history
      .slice(-12)
      .map(
        (message) =>
          `- ${message.role.toUpperCase()}: ${sanitizeInline(message.content)}`,
      )
      .join('\n')
    : '- No previous messages.'

  const documents = input.documents.length > 0
    ? input.documents
      .slice(-8)
      .map((document, index) => {
        const keyPoints = document.keyPoints.length > 0
          ? document.keyPoints.slice(0, 3).join('; ')
          : 'nessun punto chiave esplicito'
        const redFlags = document.redFlags.length > 0
          ? document.redFlags.join('; ')
          : 'nessun red flag esplicito'

        return [
          `${index + 1}. ${document.filename} (${document.documentType})`,
          `   sintesi: ${sanitizeInline(document.summary)}`,
          `   punti chiave: ${sanitizeInline(keyPoints)}`,
          `   red flag: ${sanitizeInline(redFlags)}`,
        ].join('\n')
      })
      .join('\n')
    : '- Nessun documento archiviato.'

  const uploadedDocument = input.uploadedDocument
    ? [
        'Documento appena caricato in questa chat:',
        `- nome file: ${input.uploadedDocument.filename}`,
        `- tipo: ${input.uploadedDocument.documentType}`,
        `- sintesi: ${sanitizeInline(input.uploadedDocument.summary)}`,
        `- punti chiave: ${
          input.uploadedDocument.keyPoints.length > 0
            ? sanitizeInline(input.uploadedDocument.keyPoints.join('; '))
            : 'nessun punto chiave esplicito'
        }`,
        `- red flag: ${
          input.uploadedDocument.redFlags.length > 0
            ? sanitizeInline(input.uploadedDocument.redFlags.join('; '))
            : 'nessun red flag esplicito'
        }`,
      ].join('\n')
    : 'Nessun nuovo documento allegato in questo messaggio.'

  return [
    `Profilo familiare: ${input.profile}`,
    '',
    'Messaggio corrente dell utente:',
    input.message.trim(),
    '',
    uploadedDocument,
    '',
    'Cronologia recente della chat:',
    history,
    '',
    'Archivio documentale disponibile per questo profilo:',
    documents,
    '',
    'Restituisci una risposta breve ma concreta, in italiano, che:',
    '- risponda alla domanda o al dubbio espresso',
    '- richiami eventuali segnali importanti presenti nei dati forniti',
    '- proponga solo prossimi passi conversazionali o di chiarimento',
    '- mantenga un confine non diagnostico',
  ].join('\n')
}

function buildReportPrompt(input: GenerateSituationReportInput) {
  const history = input.history.length > 0
    ? input.history
      .slice(-18)
      .map(
        (message, index) =>
          `${index + 1}. ${message.role.toUpperCase()}: ${sanitizeInline(
            message.content,
          )}`,
      )
      .join('\n')
    : 'Nessuna conversazione registrata.'

  const documents = input.documents.length > 0
    ? input.documents
      .slice(-10)
      .map((document, index) => {
        const keyPoints = document.keyPoints.length > 0
          ? document.keyPoints.join('; ')
          : 'nessun punto chiave esplicito'
        const redFlags = document.redFlags.length > 0
          ? document.redFlags.join('; ')
          : 'nessun red flag esplicito'

        return [
          `${index + 1}. ${document.filename} (${document.documentType})`,
          `   caricato: ${document.uploadedAt ?? 'data non disponibile'}`,
          `   sintesi: ${sanitizeInline(document.summary)}`,
          `   punti chiave: ${sanitizeInline(keyPoints)}`,
          `   red flag: ${sanitizeInline(redFlags)}`,
        ].join('\n')
      })
      .join('\n')
    : 'Nessun documento registrato.'

  return [
    `Profilo familiare: ${input.profile}`,
    '',
    'Crea un report dettagliato della situazione finora.',
    'Il report deve basarsi su tutto cio che e stato detto in chat e sui documenti caricati.',
    '',
    'Cronologia conversazione:',
    history,
    '',
    'Documenti associati al profilo:',
    documents,
    '',
    'Il report deve essere utile per capire:',
    '- quali temi sono emersi finora',
    '- quali segnali o pattern meritano attenzione',
    '- quali informazioni mancano ancora',
    '- quali argomenti affrontare nella prossima chat o visita',
  ].join('\n')
}

function sanitizeInline(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}
