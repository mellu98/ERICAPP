import { z } from 'zod'

const nullableString = z.string().nullable()
const nullableNumber = z.number().int().nullable()

export const medicalObservationSchema = z.object({
  category: z.enum([
    'lab_result',
    'measurement',
    'finding',
    'medication',
    'instruction',
    'appointment',
    'other',
  ]),
  label: z.string().min(1),
  value: nullableString,
  unit: nullableString,
  referenceRange: nullableString,
  interpretation: z.enum([
    'normal',
    'high',
    'low',
    'positive',
    'negative',
    'abnormal',
    'unclear',
    'not_provided',
  ]),
  pageNumber: nullableNumber,
  evidence: z.string().min(1),
})

export const medicalRedFlagSchema = z.object({
  item: z.string().min(1),
  pageNumber: nullableNumber,
  evidence: z.string().min(1),
})

export const medicalDocumentSchema = z.object({
  documentType: z.enum([
    'lab_report',
    'visit_note',
    'imaging_report',
    'prescription',
    'discharge_summary',
    'medical_certificate',
    'unknown',
  ]),
  sourceLanguage: nullableString,
  patient: z.object({
    fullName: nullableString,
    birthDate: nullableString,
    sex: nullableString,
    patientId: nullableString,
  }),
  encounter: z.object({
    facility: nullableString,
    clinician: nullableString,
    visitDate: nullableString,
    reportDate: nullableString,
    specimenDate: nullableString,
  }),
  summary: z.object({
    plainLanguage: z.string().min(1),
    keyPoints: z.array(z.string()),
    uncertaintyNotes: z.array(z.string()),
  }),
  observations: z.array(medicalObservationSchema),
  followUp: z.object({
    medicationsMentioned: z.array(z.string()),
    instructionsFromReport: z.array(z.string()),
    appointmentsOrNextSteps: z.array(z.string()),
  }),
  redFlagsMentioned: z.array(medicalRedFlagSchema),
  requiresHumanReview: z.boolean(),
})

export type MedicalDocumentExtraction = z.infer<typeof medicalDocumentSchema>

export const medicalDocumentJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    documentType: {
      type: 'string',
      enum: [
        'lab_report',
        'visit_note',
        'imaging_report',
        'prescription',
        'discharge_summary',
        'medical_certificate',
        'unknown',
      ],
    },
    sourceLanguage: {
      type: ['string', 'null'],
    },
    patient: {
      type: 'object',
      additionalProperties: false,
      properties: {
        fullName: { type: ['string', 'null'] },
        birthDate: { type: ['string', 'null'] },
        sex: { type: ['string', 'null'] },
        patientId: { type: ['string', 'null'] },
      },
      required: ['fullName', 'birthDate', 'sex', 'patientId'],
    },
    encounter: {
      type: 'object',
      additionalProperties: false,
      properties: {
        facility: { type: ['string', 'null'] },
        clinician: { type: ['string', 'null'] },
        visitDate: { type: ['string', 'null'] },
        reportDate: { type: ['string', 'null'] },
        specimenDate: { type: ['string', 'null'] },
      },
      required: [
        'facility',
        'clinician',
        'visitDate',
        'reportDate',
        'specimenDate',
      ],
    },
    summary: {
      type: 'object',
      additionalProperties: false,
      properties: {
        plainLanguage: { type: 'string' },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
        },
        uncertaintyNotes: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['plainLanguage', 'keyPoints', 'uncertaintyNotes'],
    },
    observations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          category: {
            type: 'string',
            enum: [
              'lab_result',
              'measurement',
              'finding',
              'medication',
              'instruction',
              'appointment',
              'other',
            ],
          },
          label: { type: 'string' },
          value: { type: ['string', 'null'] },
          unit: { type: ['string', 'null'] },
          referenceRange: { type: ['string', 'null'] },
          interpretation: {
            type: 'string',
            enum: [
              'normal',
              'high',
              'low',
              'positive',
              'negative',
              'abnormal',
              'unclear',
              'not_provided',
            ],
          },
          pageNumber: { type: ['integer', 'null'] },
          evidence: { type: 'string' },
        },
        required: [
          'category',
          'label',
          'value',
          'unit',
          'referenceRange',
          'interpretation',
          'pageNumber',
          'evidence',
        ],
      },
    },
    followUp: {
      type: 'object',
      additionalProperties: false,
      properties: {
        medicationsMentioned: {
          type: 'array',
          items: { type: 'string' },
        },
        instructionsFromReport: {
          type: 'array',
          items: { type: 'string' },
        },
        appointmentsOrNextSteps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: [
        'medicationsMentioned',
        'instructionsFromReport',
        'appointmentsOrNextSteps',
      ],
    },
    redFlagsMentioned: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          item: { type: 'string' },
          pageNumber: { type: ['integer', 'null'] },
          evidence: { type: 'string' },
        },
        required: ['item', 'pageNumber', 'evidence'],
      },
    },
    requiresHumanReview: { type: 'boolean' },
  },
  required: [
    'documentType',
    'sourceLanguage',
    'patient',
    'encounter',
    'summary',
    'observations',
    'followUp',
    'redFlagsMentioned',
    'requiresHumanReview',
  ],
} as const
