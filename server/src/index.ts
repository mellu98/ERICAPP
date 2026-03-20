import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import {
  isSupportedMedicalDocument,
  parseMedicalDocument,
} from './lib/documentParser.js'

const app = Fastify({
  logger: true,
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
    <title>ERICAPP Parser</title>
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
        width: min(780px, 100%);
        background: #161b22;
        border: 1px solid #2f3845;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
      }
      h1, h2, p {
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
      <span class="pill">ERICAPP parser online</span>
      <h1>Parser PDF e immagini</h1>
      <p class="muted">
        Questo servizio accetta PDF e immagini di referti/visite, li invia al parser
        multimodale e restituisce JSON strutturato.
      </p>

      <div class="grid">
        <div>
          <h2>Endpoint utili</h2>
          <p><a href="/health">GET /health</a> per il controllo rapido.</p>
          <p><code>POST /api/parse-medical-document</code> per il parsing vero.</p>
        </div>

        <div>
          <h2>Prova dal browser</h2>
          <form action="/api/parse-medical-document" method="post" enctype="multipart/form-data">
            <select name="profile">
              <option value="">Seleziona sezione persona</option>
              <option value="Erica">Erica</option>
              <option value="Lina">Lina</option>
              <option value="Antonio">Antonio</option>
              <option value="Keyssy">Keyssy</option>
            </select>
            <input type="file" name="file" accept=".pdf,image/jpeg,image/png,image/webp" required />
            <textarea name="context" placeholder="Contesto opzionale: esame del sangue di controllo, referto visita, immagine lab ecc."></textarea>
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
  service: 'ericapp-document-parser',
}))

app.post('/api/parse-medical-document', async (request, reply) => {
  const part = await request.file()

  if (!part) {
    return reply.code(400).send({
      error: 'A PDF or image file is required.',
    })
  }

  if (!isSupportedMedicalDocument(part.mimetype)) {
    return reply.code(415).send({
      error: `Unsupported file type: ${part.mimetype}`,
    })
  }

  const context = readMultipartField(part.fields, 'context')
  const profile = readMultipartField(part.fields, 'profile')
  const bytes = await part.toBuffer()

  const result = await parseMedicalDocument({
    bytes,
    filename: part.filename,
    mimeType: part.mimetype,
    context,
    profile,
  })

  return reply.send({
    ok: true,
    file: {
      filename: part.filename,
      mimeType: part.mimetype,
      size: bytes.byteLength,
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

function readMultipartField(
  fields: Record<string, unknown> | undefined,
  fieldName: string,
) {
  const field = fields?.[fieldName]

  if (!field || Array.isArray(field) || typeof field !== 'object') {
    return undefined
  }

  if (!('value' in field)) {
    return undefined
  }

  return typeof field.value === 'string' ? field.value : undefined
}
