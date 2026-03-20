import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import Fastify, { type FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  conversationMessageSchema,
  documentContextSchema,
} from './lib/assistantSchemas.js'
import {
  generateProfileChatReply,
  generateSituationReport,
} from './lib/familyAssistant.js'
import {
  isSupportedMedicalDocument,
  parseMedicalDocument,
} from './lib/documentParser.js'

const profileNameSchema = z.enum(['Erica', 'Lina', 'Antonio', 'Keyssy'])
const historySchema = z.array(conversationMessageSchema)
const documentLibrarySchema = z.array(documentContextSchema)

const reportRequestSchema = z.object({
  profile: profileNameSchema,
  history: historySchema.default([]),
  documents: documentLibrarySchema.default([]),
})

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: buildCorsOrigin(),
})

await app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
})

app.get('/', async (_request, reply) => {
  return reply.type('text/html').send(`<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ERICAPP AI Backend</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: ui-sans-serif, system-ui, sans-serif;
      }
      body {
        margin: 0;
        min-height: 100vh;
        background: #0d1117;
        color: #f3f4f6;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      main {
        width: min(860px, 100%);
        background: #161b22;
        border: 1px solid #2f3845;
        border-radius: 22px;
        padding: 24px;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
      }
      h1, h2, p, ul {
        margin-top: 0;
      }
      .muted {
        color: #9ca3af;
      }
      .pill {
        display: inline-flex;
        padding: 0.35rem 0.65rem;
        border-radius: 999px;
        background: #0f3d35;
        color: #8be9cc;
        font-weight: 700;
        margin-bottom: 16px;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      form {
        display: grid;
        gap: 12px;
        margin-top: 18px;
      }
      input, textarea, select, button {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #374151;
        background: #0d1117;
        color: #f3f4f6;
        padding: 12px 14px;
        box-sizing: border-box;
      }
      textarea {
        min-height: 120px;
        resize: vertical;
      }
      button {
        background: #1d4ed8;
        border: none;
        font-weight: 700;
        cursor: pointer;
      }
      a {
        color: #93c5fd;
      }
      code {
        background: #0d1117;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 0.12rem 0.35rem;
      }
    </style>
  </head>
  <body>
    <main>
      <span class="pill">ERICAPP AI backend online</span>
      <h1>Chat, report e parser documentale</h1>
      <p class="muted">
        Questo servizio alimenta le 4 chat persona della PWA, riceve documenti in
        chat, usa GPT-5.4 per generare risposta e costruisce un report dettagliato
        per ciascun profilo.
      </p>

      <div class="grid">
        <div>
          <h2>Endpoint utili</h2>
          <ul>
            <li><a href="/health">GET /health</a></li>
            <li><code>POST /api/parse-medical-document</code></li>
            <li><code>POST /api/profile-chat</code></li>
            <li><code>POST /api/profile-report</code></li>
          </ul>
        </div>

        <div>
          <h2>Test parser dal browser</h2>
          <form action="/api/parse-medical-document" method="post" enctype="multipart/form-data">
            <select name="profile">
              <option value="Erica">Erica</option>
              <option value="Lina">Lina</option>
              <option value="Antonio">Antonio</option>
              <option value="Keyssy">Keyssy</option>
            </select>
            <input type="file" name="file" accept=".pdf,image/jpeg,image/png,image/webp" required />
            <textarea name="context" placeholder="Contesto opzionale: visita di controllo, emocromo, referto immagine..."></textarea>
            <button type="submit">Invia al parser</button>
          </form>
        </div>
      </div>
    </main>
  </body>
</html>`)
})

app.get('/health', async () => ({
  ok: true,
  service: 'ericapp-family-assistant',
}))

app.post('/api/parse-medical-document', async (request, reply) => {
  const payload = await readMultipartPayload(request)

  if (!payload.file) {
    return reply.code(400).send({
      error: 'A PDF or image file is required.',
    })
  }

  if (!isSupportedMedicalDocument(payload.file.mimeType)) {
    return reply.code(415).send({
      error: `Unsupported file type: ${payload.file.mimeType}`,
    })
  }

  const profile = profileNameSchema.optional().parse(payload.fields.profile)
  const context = payload.fields.context

  const result = await parseMedicalDocument({
    bytes: payload.file.bytes,
    filename: payload.file.filename,
    mimeType: payload.file.mimeType,
    context,
    profile,
  })

  return reply.send({
    ok: true,
    file: {
      filename: payload.file.filename,
      mimeType: payload.file.mimeType,
      size: payload.file.bytes.byteLength,
    },
    parser: {
      model: result.model,
      responseId: result.responseId,
      traceId: result.traceId,
    },
    profile: profile ?? null,
    document: result.document,
  })
})

app.post('/api/profile-chat', async (request, reply) => {
  const payload = await readMultipartPayload(request)
  const profile = profileNameSchema.parse(payload.fields.profile)
  const message = payload.fields.message?.trim()

  if (!message) {
    return reply.code(400).send({
      error: 'A chat message is required.',
    })
  }

  const history = parseJsonField(payload.fields.history, historySchema, [])
  const documents = parseJsonField(
    payload.fields.documents,
    documentLibrarySchema,
    [],
  )

  let attachment: null | {
    filename: string
    mimeType: string
    size: number
    parsedDocument: Awaited<ReturnType<typeof parseMedicalDocument>>['document']
    snapshot: z.infer<typeof documentContextSchema>
  } = null

  if (payload.file) {
    if (!isSupportedMedicalDocument(payload.file.mimeType)) {
      return reply.code(415).send({
        error: `Unsupported file type: ${payload.file.mimeType}`,
      })
    }

    const parsedFile = await parseMedicalDocument({
      bytes: payload.file.bytes,
      filename: payload.file.filename,
      mimeType: payload.file.mimeType,
      context: message,
      profile,
    })

    attachment = {
      filename: payload.file.filename,
      mimeType: payload.file.mimeType,
      size: payload.file.bytes.byteLength,
      parsedDocument: parsedFile.document,
      snapshot: createDocumentSnapshot(
        payload.file.filename,
        payload.file.mimeType,
        parsedFile.document,
      ),
    }
  }

  const result = await generateProfileChatReply({
    profile,
    message,
    history,
    documents: attachment ? [...documents, attachment.snapshot] : documents,
    uploadedDocument: attachment?.snapshot,
  })

  return reply.send({
    ok: true,
    profile,
    assistant: {
      ...result.reply,
      model: result.model,
      responseId: result.responseId,
    },
    attachment,
  })
})

app.post('/api/profile-report', async (request, reply) => {
  const payload = reportRequestSchema.parse(request.body ?? {})
  const result = await generateSituationReport(payload)

  return reply.send({
    ok: true,
    profile: payload.profile,
    report: {
      ...result.report,
      generatedAt: new Date().toISOString(),
      messageCount: payload.history.length,
      documentCount: payload.documents.length,
      model: result.model,
      responseId: result.responseId,
    },
  })
})

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error)
  const message = error instanceof Error ? error.message : 'Unknown error'

  return reply.code(500).send({
    ok: false,
    error: message,
  })
})

const port = Number(process.env.PORT ?? 8787)

await app.listen({
  host: '0.0.0.0',
  port,
})

function createDocumentSnapshot(
  filename: string,
  mimeType: string,
  document: Awaited<ReturnType<typeof parseMedicalDocument>>['document'],
) {
  return documentContextSchema.parse({
    filename,
    mimeType,
    uploadedAt: new Date().toISOString(),
    documentType: document.documentType,
    summary: document.summary.plainLanguage,
    keyPoints: document.summary.keyPoints,
    redFlags: document.redFlagsMentioned.map((item) => item.item),
    requiresHumanReview: true,
  })
}

function buildCorsOrigin() {
  const configuredOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (!configuredOrigins || configuredOrigins.length === 0) {
    return true
  }

  return configuredOrigins
}

async function readMultipartPayload(request: FastifyRequest) {
  const fields: Record<string, string> = {}
  let file:
    | {
        bytes: Buffer
        filename: string
        mimeType: string
      }
    | undefined

  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (file) {
        throw new Error('Only one file per request is supported.')
      }

      file = {
        bytes: await part.toBuffer(),
        filename: part.filename,
        mimeType: part.mimetype,
      }
      continue
    }

    fields[part.fieldname] =
      typeof part.value === 'string' ? part.value : String(part.value)
  }

  return {
    fields,
    file,
  }
}

function parseJsonField<T>(
  value: string | undefined,
  schema: z.ZodType<T>,
  fallback: T,
) {
  if (!value?.trim()) {
    return fallback
  }

  return schema.parse(JSON.parse(value))
}
