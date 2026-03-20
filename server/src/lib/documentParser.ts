import { createHash } from 'node:crypto'
import { getOpenAIClient } from './openai.js'
import {
  medicalDocumentJsonSchema,
  medicalDocumentSchema,
  type MedicalDocumentExtraction,
} from './schema.js'

const SUPPORTED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const SYSTEM_PROMPT = `
You extract structured data from medical documents for a family wellness app.

Rules:
- Extract only information explicitly present in the uploaded document or image.
- Do not diagnose, infer causes, or recommend treatment changes.
- Preserve units, dates, and reference ranges exactly when visible.
- If a field is unclear, return null or "unclear" and mention the uncertainty.
- Keep evidence snippets short and grounded in the source text.
- requiresHumanReview must always be true.
- If the document mentions urgent or concerning findings, capture them in redFlagsMentioned without adding new advice.
`.trim()

export type ParseMedicalDocumentInput = {
  bytes: Buffer
  filename: string
  mimeType: string
  context?: string
  profile?: string
}

export type ParseMedicalDocumentResult = {
  document: MedicalDocumentExtraction
  model: string
  responseId: string
  traceId: string
}

export function isSupportedMedicalDocument(mimeType: string) {
  return SUPPORTED_MIME_TYPES.has(mimeType)
}

export async function parseMedicalDocument(
  input: ParseMedicalDocumentInput,
): Promise<ParseMedicalDocumentResult> {
  if (!isSupportedMedicalDocument(input.mimeType)) {
    throw new Error(`Unsupported MIME type: ${input.mimeType}`)
  }

  const client = getOpenAIClient()
  const model = process.env.OPENAI_MEDICAL_PARSER_MODEL ?? 'gpt-5.4'
  const uploadedFile = new File(
    [Uint8Array.from(input.bytes)],
    input.filename,
    {
      type: input.mimeType,
    },
  )

  const openaiFile = await client.files.create({
    file: uploadedFile,
    purpose: 'user_data',
  })

  const response = await client.responses.create({
    model,
    store: false,
    text: {
      format: {
        type: 'json_schema',
        name: 'medical_document_extraction',
        strict: true,
        schema: medicalDocumentJsonSchema,
      },
    },
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: buildUserPrompt(input),
          },
          buildFileInput(openaiFile.id, input.mimeType),
        ],
      },
    ],
  })

  const outputText = response.output_text

  if (!outputText) {
    throw new Error('The parser returned an empty response.')
  }

  const parsed = medicalDocumentSchema.parse(JSON.parse(outputText))
  const traceId = createHash('sha256')
    .update(`${input.filename}:${openaiFile.id}:${response.id}`)
    .digest('hex')
    .slice(0, 16)

  return {
    document: {
      ...parsed,
      requiresHumanReview: true,
    },
    model,
    responseId: response.id,
    traceId,
  }
}

function buildUserPrompt(input: ParseMedicalDocumentInput) {
  const contextBlock = input.context?.trim()
    ? `Additional caregiver context:\n${input.context.trim()}\n\n`
    : ''
  const profileBlock = input.profile?.trim()
    ? `Family profile section: ${input.profile.trim()}\n`
    : ''

  return [
    'Parse the uploaded medical file into the provided JSON schema.',
    'Summaries must stay descriptive and non-diagnostic.',
    'For lab reports, capture the most important analytes and any explicitly flagged values.',
    'For visit notes or imaging reports, capture findings, instructions, medications mentioned, and next steps only if written in the document.',
    `${contextBlock}${profileBlock}Document filename: ${input.filename}`,
    `Document MIME type: ${input.mimeType}`,
  ].join('\n')
}

function buildFileInput(fileId: string, mimeType: string) {
  if (mimeType === 'application/pdf') {
    return {
      type: 'input_file' as const,
      file_id: fileId,
    }
  }

  return {
    type: 'input_image' as const,
    file_id: fileId,
    detail: 'auto' as const,
  }
}
