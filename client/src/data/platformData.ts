import type { PersonProfile, PersonThreadState } from '../types/platform'

export const profiles: PersonProfile[] = [
  {
    id: 'erica',
    name: 'Erica',
    subtitle: 'Chat privata, documenti personali e report dinamico',
    summary:
      'Erica ha una conversazione separata dove puoi scrivere, allegare referti e ricostruire la situazione fino a oggi.',
    tone: 'amber',
    status: 'Chat personale attiva',
    reportLead:
      'Il report di Erica tiene insieme sintomi descritti, referti caricati e temi emersi in chat.',
    assistantName: 'Assistente Erica',
  },
  {
    id: 'lina',
    name: 'Lina',
    subtitle: 'Storico dedicato con analisi conversazionale',
    summary:
      'Lina ha il suo chatbot dedicato e un report che si aggiorna in base a quello che viene detto e ai documenti allegati.',
    tone: 'teal',
    status: 'Profilo ordinato',
    reportLead:
      'Il report di Lina mette a fuoco andamento, dubbi aperti e follow-up da chiarire.',
    assistantName: 'Assistente Lina',
  },
  {
    id: 'antonio',
    name: 'Antonio',
    subtitle: 'Chat prudente per monitoraggio e segnali da non ignorare',
    summary:
      'Antonio ha una sezione piu prudente: la chat resta descrittiva e il report evidenzia rapidamente i punti che meritano attenzione.',
    tone: 'rose',
    status: 'Linea prudente attiva',
    reportLead:
      'Il report di Antonio concentra i segnali chiave e le domande da portare a un professionista.',
    assistantName: 'Assistente Antonio',
  },
  {
    id: 'keyssy',
    name: 'Keyssy',
    subtitle: 'Upload veloci di immagini/PDF e memoria contestuale',
    summary:
      'Keyssy ha uno spazio personale per immagini di referti, PDF, domande in chat e riepilogo dettagliato.',
    tone: 'teal',
    status: 'Pronta a nuovi upload',
    reportLead:
      'Il report di Keyssy incrocia note conversazionali e documenti gia discussi.',
    assistantName: 'Assistente Keyssy',
  },
]

export function createInitialThreadState(): Record<string, PersonThreadState> {
  const now = new Date().toISOString()

  return Object.fromEntries(
    profiles.map((profile) => [
      profile.id,
      {
        messages: [
          {
            id: `${profile.id}-welcome`,
            role: 'assistant',
            content: [
              `Sono ${profile.assistantName}.`,
              'Qui puoi scrivere liberamente, allegare PDF o immagini di referti e chiedere un riepilogo ordinato.',
              'Tutto resta dentro questa persona e il report si aggiorna in base alla chat e ai documenti caricati.',
            ].join(' '),
            createdAt: now,
            cautionLevel: 'calm',
            keySignals: [
              'Chat separata per profilo',
              'Documenti allegabili direttamente nella conversazione',
              'Report dettagliato generato dallo storico',
            ],
            nextSteps: [
              'Scrivi la prima domanda',
              'Allega un referto o un esame se vuoi contestualizzare',
            ],
          },
        ],
        documents: [],
        report: null,
        isSending: false,
        isRefreshingReport: false,
        error: null,
      },
    ]),
  )
}
