import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ChatMessage, PersonProfile, PersonThreadState } from '../../types/platform'

export type ChatWorkspaceProps = {
  profile: PersonProfile
  thread: PersonThreadState
  uploadSignal: number
  refreshSignal: number
  onSendMessage: (payload: { text: string; file?: File | null }) => Promise<void>
  onRefreshReport: () => Promise<void>
}

const chatStatusLabelMap = {
  calm: 'Linea calma',
  watch: 'Da seguire',
  escalate: 'Attenzione alta',
} as const

const reportStatusLabelMap = {
  stable_context: 'Contesto stabile',
  needs_follow_up: 'Serve follow-up',
  attention_needed: 'Attenzione da verificare',
} as const

export function ChatWorkspace({
  profile,
  thread,
  uploadSignal,
  refreshSignal,
  onSendMessage,
  onRefreshReport,
}: ChatWorkspaceProps) {
  const [draft, setDraft] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [thread.messages])

  useEffect(() => {
    if (uploadSignal > 0) {
      fileInputRef.current?.click()
    }
  }, [uploadSignal])

  useEffect(() => {
    if (refreshSignal > 0 && !thread.isRefreshingReport) {
      void onRefreshReport()
    }
  }, [onRefreshReport, refreshSignal, thread.isRefreshingReport])

  useEffect(() => {
    setDraft('')
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [profile.id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (thread.isSending) {
      return
    }

    const text = draft.trim() || 'Puoi analizzare il documento allegato in modo semplice?'

    if (!draft.trim() && !selectedFile) {
      return
    }

    const file = selectedFile
    setDraft('')
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    try {
      await onSendMessage({
        text,
        file,
      })
    } catch {
      setDraft(draft)
      setSelectedFile(file)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
  }

  const latestAssistantMessage = [...thread.messages]
    .reverse()
    .find((message) => message.role === 'assistant')

  return (
    <div className="chat-workspace">
      <div className="chat-workspace__main">
        <section className="chat-panel">
          <div className="chat-panel__header">
            <div>
              <p className="chat-panel__eyebrow">Chat privata di {profile.name}</p>
              <h3 className="chat-panel__title">{profile.assistantName}</h3>
              <p className="chat-panel__subtitle">{profile.summary}</p>
            </div>

            <div className="chat-panel__statusGroup">
              <span className={`chat-chip is-${profile.tone}`}>{profile.status}</span>
              {latestAssistantMessage?.cautionLevel ? (
                <span
                  className={`chat-chip is-${mapCautionToTone(
                    latestAssistantMessage.cautionLevel,
                  )}`}
                >
                  {chatStatusLabelMap[latestAssistantMessage.cautionLevel]}
                </span>
              ) : null}
            </div>
          </div>

          <div className="chat-thread" ref={messagesRef}>
            {thread.messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <label className="composer__field">
              <span className="composer__label">Scrivi nella chat di {profile.name}</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Scrivi un messaggio per ${profile.name}, oppure allega un referto e chiedi una sintesi...`}
                rows={5}
              />
            </label>

            <div className="composer__actions">
              <input
                ref={fileInputRef}
                className="composer__fileInput"
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />

              <button
                type="button"
                className="composer__secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? `Allegato: ${selectedFile.name}` : 'Allega PDF o immagine'}
              </button>

              <button
                type="button"
                className="composer__ghost"
                onClick={() => void onRefreshReport()}
                disabled={thread.isRefreshingReport || thread.isSending}
              >
                {thread.isRefreshingReport ? 'Aggiorno report...' : 'Aggiorna report'}
              </button>

              <button
                type="submit"
                className="composer__primary"
                disabled={thread.isSending}
              >
                {thread.isSending ? 'Invio in corso...' : 'Invia a GPT-5.4'}
              </button>
            </div>

            {thread.error ? (
              <p className="composer__error" role="alert">
                {thread.error}
              </p>
            ) : null}
          </form>
        </section>
      </div>

      <aside className="chat-workspace__aside">
        <section className="report-panel">
          <div className="report-panel__header">
            <div>
              <p className="report-panel__eyebrow">Report situazione</p>
              <h3 className="report-panel__title">Stato attuale di {profile.name}</h3>
              <p className="report-panel__subtitle">{profile.reportLead}</p>
            </div>
            {thread.report ? (
              <span
                className={`chat-chip is-${mapReportToTone(
                  thread.report.overallStatus,
                )}`}
              >
                {reportStatusLabelMap[thread.report.overallStatus]}
              </span>
            ) : null}
          </div>

          {thread.report ? (
            <div className="report-panel__body">
              <div className="report-summary">
                <strong>{thread.report.headline}</strong>
                <p>{thread.report.narrative}</p>
              </div>

              <div className="report-metrics">
                <div>
                  <span>Messaggi</span>
                  <strong>{thread.report.messageCount}</strong>
                </div>
                <div>
                  <span>Documenti</span>
                  <strong>{thread.report.documentCount}</strong>
                </div>
              </div>

              <ReportBlock
                title="Conversazione"
                items={[thread.report.conversationSummary]}
              />
              <ReportBlock title="Documenti" items={[thread.report.documentSummary]} />
              <ReportBlock title="Segnali chiave" items={thread.report.keySignals} />
              <ReportBlock
                title="Timeline recente"
                items={thread.report.timelineHighlights}
              />
              <ReportBlock
                title="Domande aperte"
                items={thread.report.openQuestions}
              />
              <ReportBlock
                title="Prossimi temi"
                items={thread.report.suggestedNextTopics}
              />
              <ReportBlock
                title="Cautele"
                items={thread.report.cautionNotes}
              />

              <p className="report-panel__meta">
                Aggiornato alle {formatDateTime(thread.report.generatedAt)}
              </p>
            </div>
          ) : (
            <div className="report-placeholder">
              <p>
                Il report dettagliato nascera da questa chat. Invia un messaggio o
                allega un referto per generare il primo riepilogo.
              </p>
            </div>
          )}
        </section>

        <section className="documents-panel">
          <div className="documents-panel__header">
            <div>
              <p className="report-panel__eyebrow">Documenti in memoria</p>
              <h3 className="report-panel__title">Archivio di {profile.name}</h3>
            </div>
            <span className="documents-panel__count">{thread.documents.length}</span>
          </div>

          {thread.documents.length > 0 ? (
            <div className="documents-list">
              {[...thread.documents].reverse().map((document) => (
                <article key={document.id} className="document-card">
                  <div className="document-card__top">
                    <strong>{document.filename}</strong>
                    <span>{formatDateTime(document.uploadedAt)}</span>
                  </div>
                  <p>{document.summary}</p>
                  <div className="document-tags">
                    <span className="document-tag">{document.documentType}</span>
                    {document.redFlags.length > 0 ? (
                      <span className="document-tag is-rose">
                        {document.redFlags.length} red flag
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="report-placeholder is-small">
              <p>Nessun documento ancora caricato in questa sezione.</p>
            </div>
          )}
        </section>
      </aside>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <article className={`message ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className="message__meta">
        <strong>{isUser ? 'Tu' : 'Assistente AI'}</strong>
        <span>{formatDateTime(message.createdAt)}</span>
      </div>

      <p className="message__content">{message.content}</p>

      {message.attachment ? (
        <div className="message-attachment">
          <strong>{message.attachment.filename}</strong>
          <p>{message.attachment.summary}</p>
        </div>
      ) : null}

      {!isUser && (message.keySignals?.length || message.nextSteps?.length) ? (
        <div className="message__details">
          {message.keySignals?.length ? (
            <ReportBlock title="Segnali richiamati" items={message.keySignals} />
          ) : null}
          {message.nextSteps?.length ? (
            <ReportBlock title="Passi successivi" items={message.nextSteps} compact />
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function ReportBlock({
  title,
  items,
  compact = false,
}: {
  title: string
  items: string[]
  compact?: boolean
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className={`report-block ${compact ? 'is-compact' : ''}`}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={`${title}-${item}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function mapCautionToTone(cautionLevel: 'calm' | 'watch' | 'escalate') {
  if (cautionLevel === 'watch') {
    return 'amber'
  }

  if (cautionLevel === 'escalate') {
    return 'rose'
  }

  return 'teal'
}

function mapReportToTone(
  overallStatus: 'stable_context' | 'needs_follow_up' | 'attention_needed',
) {
  if (overallStatus === 'needs_follow_up') {
    return 'amber'
  }

  if (overallStatus === 'attention_needed') {
    return 'rose'
  }

  return 'teal'
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
