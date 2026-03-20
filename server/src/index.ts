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
  const bytes = await part.toBuffer()

  const result = await parseMedicalDocument({
    bytes,
    filename: part.filename,
    mimeType: part.mimetype,
    context,
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
