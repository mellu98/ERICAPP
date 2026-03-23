import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AlertCircle,
  FileText,
  FolderOpen,
  Loader2,
  MessageCircle,
  Paperclip,
  Send,
} from 'lucide-react'
import type { ChatMessage, PersonProfile, PersonThreadState } from '../../types/platform'
import { cn } from '../../lib/utils'

export type ChatWorkspaceProps = {
  profile: PersonProfile
  thread: PersonThreadState
  uploadSignal: number
  refreshSignal: number
  onSendMessage: (payload: { text: string; file?: File | null }) => Promise<void>
  onRefreshReport: () => Promise<void>
}

type MobileTab = 'chat' | 'report' | 'docs'

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

function toneFromCaution(level: 'calm' | 'watch' | 'escalate') {
  if (level === 'escalate') return 'rose'
  if (level === 'watch') return 'amber'
  return 'teal'
}

function toneFromReport(status: 'stable_context' | 'needs_follow_up' | 'attention_needed') {
  if (status === 'attention_needed') return 'rose'
  if (status === 'needs_follow_up') return 'amber'
  return 'teal'
}

const cautionBadgeStyles = {
  teal: 'bg-[rgba(0,212,170,0.1)] text-[#00d4aa] border-[rgba(0,212,170,0.22)]',
  amber: 'bg-[rgba(245,166,35,0.1)] text-[#f5a623] border-[rgba(245,166,35,0.22)]',
  rose: 'bg-[rgba(244,63,94,0.1)] text-[#f43f5e] border-[rgba(244,63,94,0.22)]',
}

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
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat')
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
    setMobileTab('chat')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [profile.id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (thread.isSending) return

    const text = draft.trim() || 'Puoi analizzare il documento allegato in modo semplice?'
    if (!draft.trim() && !selectedFile) return

    const savedDraft = draft
    const file = selectedFile
    setDraft('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    try {
      await onSendMessage({ text, file })
    } catch {
      setDraft(savedDraft)
      setSelectedFile(file)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      const form = event.currentTarget.closest('form')
      form?.requestSubmit()
    }
  }

  const latestAssistantMessage = [...thread.messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  const showAside = mobileTab === 'report' || mobileTab === 'docs'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mobile tab bar */}
      <div className="md:hidden flex shrink-0 border-b border-white/[0.08] bg-[rgba(7,7,17,0.85)] backdrop-blur-sm">
        {(
          [
            { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
            { id: 'report' as const, label: 'Report', icon: FileText },
            { id: 'docs' as const, label: `Doc (${thread.documents.length})`, icon: FolderOpen },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            className={cn(
              'flex items-center justify-center gap-2 flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2',
              mobileTab === tab.id
                ? 'text-[#00d4aa] border-[#00d4aa]'
                : 'text-white/25 border-transparent hover:text-white/50',
            )}
          >
            <tab.icon className="w-3.5 h-3.5 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content row */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Chat column ── */}
        <div
          className={cn(
            'flex-col flex-1 min-w-0 min-h-0 overflow-hidden',
            mobileTab === 'chat' ? 'flex' : 'hidden md:flex',
          )}
        >
          {/* Chat header — desktop only */}
          <div className="hidden md:flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                Chat privata di {profile.name}
              </p>
              <h3 className="text-sm font-bold text-[#eae8f2] mt-0.5">{profile.assistantName}</h3>
            </div>
            {latestAssistantMessage?.cautionLevel ? (
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg border',
                  cautionBadgeStyles[toneFromCaution(latestAssistantMessage.cautionLevel)],
                )}
              >
                {chatStatusLabelMap[latestAssistantMessage.cautionLevel]}
              </span>
            ) : null}
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto px-3 py-5 space-y-5"
          >
            {thread.messages.map((message) => (
              <ChatBubble key={message.id} message={message} profile={profile} />
            ))}
            {thread.isSending && <TypingIndicator assistantName={profile.assistantName} />}
          </div>

          {/* Error */}
          {thread.error ? (
            <div className="mx-4 mb-2 px-3 py-2.5 rounded-xl bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] flex items-start gap-2 shrink-0">
              <AlertCircle className="w-4 h-4 text-[#f43f5e] shrink-0 mt-0.5" />
              <p className="text-xs text-[#f43f5e] leading-relaxed">{thread.error}</p>
            </div>
          ) : null}

          {/* Composer */}
          <div className="shrink-0 px-3 py-2.5 border-t border-white/[0.08] bg-[rgba(7,7,17,0.6)] backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Scrivi a ${profile.name}… o allega un referto`}
                  rows={2}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 pt-2.5 pb-10 text-sm text-[#eae8f2] placeholder-white/25 resize-none focus:outline-none focus:border-[rgba(0,212,170,0.4)] focus:bg-white/[0.07] transition-all leading-relaxed"
                />

                {/* Inline action bar */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all max-w-[150px]',
                      selectedFile
                        ? 'text-[#00d4aa] bg-[rgba(0,212,170,0.12)] border border-[rgba(0,212,170,0.25)]'
                        : 'text-white/40 hover:text-white/65 hover:bg-white/[0.06] border border-white/[0.06]',
                    )}
                    title="Allega PDF o immagine"
                  >
                    <Paperclip className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {selectedFile ? selectedFile.name : 'Allega'}
                    </span>
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void onRefreshReport()}
                      disabled={thread.isRefreshingReport || thread.isSending}
                      className="text-[11px] text-white/35 hover:text-white/65 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.05] transition-all"
                    >
                      {thread.isRefreshingReport ? 'Aggiorno...' : 'Aggiorna report'}
                    </button>

                    <button
                      type="submit"
                      disabled={thread.isSending || (!draft.trim() && !selectedFile)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00d4aa] text-[#070711] text-xs font-bold hover:bg-[#00c49e] active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-lg shadow-[rgba(0,212,170,0.25)]"
                    >
                      {thread.isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      {thread.isSending ? 'Invio...' : 'Invia'}
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </form>
          </div>
        </div>

        {/* ── Aside: Report + Documents ── */}
        <aside
          className={cn(
            'flex-col overflow-y-auto',
            'md:flex md:w-72 lg:w-80 md:border-l md:border-white/[0.07]',
            showAside ? 'flex flex-1' : 'hidden md:flex',
          )}
        >
          {/* Report panel */}
          <ReportPanel profile={profile} thread={thread} />

          {/* Documents panel */}
          <DocumentsPanel profile={profile} thread={thread} />
        </aside>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Chat Bubble
───────────────────────────────────────── */

function ChatBubble({ message, profile }: { message: ChatMessage; profile: PersonProfile }) {
  const isUser = message.role === 'user'

  return (
    <article className={cn('flex gap-2.5 msg-appear', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-1',
          isUser
            ? 'bg-white/[0.07] border border-white/[0.1] text-white/50'
            : 'bg-[rgba(0,212,170,0.12)] border border-[rgba(0,212,170,0.22)] text-[#00d4aa]',
        )}
      >
        {isUser ? 'Tu' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'flex flex-col',
          isUser ? 'items-end max-w-[72%]' : 'items-start max-w-[86%]',
        )}
      >
        <div
          className={cn(
            'px-4 py-3 rounded-2xl border',
            isUser
              ? 'rounded-tr-sm bg-[rgba(0,212,170,0.09)] border-[rgba(0,212,170,0.18)]'
              : 'rounded-tl-sm bg-white/[0.04] border-white/[0.09]',
          )}
        >
          {!isUser && (
            <p className="text-[10px] font-bold text-[#00d4aa] mb-2 uppercase tracking-wider leading-none">
              {profile.assistantName}
            </p>
          )}

          <p className="text-[13px] text-[#eae8f2] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Attachment */}
          {message.attachment ? (
            <div className="mt-3 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1]">
              <p className="text-[11px] font-bold text-[#eae8f2] truncate">
                {message.attachment.filename}
              </p>
              <p className="text-[11px] text-white/45 mt-1 leading-relaxed line-clamp-2">
                {message.attachment.summary}
              </p>
            </div>
          ) : null}

          {/* Signals + next steps */}
          {!isUser && (message.keySignals?.length || message.nextSteps?.length) ? (
            <div className="mt-3 space-y-2">
              {message.keySignals?.length ? (
                <InlineList title="Segnali" items={message.keySignals} />
              ) : null}
              {message.nextSteps?.length ? (
                <InlineList title="Passi successivi" items={message.nextSteps} />
              ) : null}
            </div>
          ) : null}
        </div>

        <time
          className="text-[10px] text-white/20 mt-1 px-1"
          dateTime={message.createdAt}
        >
          {formatDateTime(message.createdAt)}
        </time>
      </div>
    </article>
  )
}

function InlineList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="pt-2.5 mt-0.5 border-t border-white/[0.1]">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/35 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[11px] text-white/55 leading-snug">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]/30 shrink-0 mt-1" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─────────────────────────────────────────
   Typing Indicator
───────────────────────────────────────── */

function TypingIndicator({ assistantName }: { assistantName: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[rgba(0,212,170,0.15)] border border-[rgba(0,212,170,0.25)] flex items-center justify-center shrink-0 text-[#00d4aa] text-[10px] font-bold">
        AI
      </div>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3">
        <p className="text-[11px] font-bold text-[#00d4aa] mb-2 leading-none">{assistantName}</p>
        <div className="flex items-center gap-1.5">
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Report Panel
───────────────────────────────────────── */

function ReportPanel({ profile, thread }: { profile: PersonProfile; thread: PersonThreadState }) {
  const reportTone = thread.report ? toneFromReport(thread.report.overallStatus) : null

  return (
    <section className="p-4 border-b border-white/[0.07]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Report situazione
          </p>
          <h3 className="text-sm font-bold text-[#eae8f2] mt-0.5">Stato di {profile.name}</h3>
        </div>
        {thread.report && reportTone ? (
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg border shrink-0',
              cautionBadgeStyles[reportTone],
            )}
          >
            {reportStatusLabelMap[thread.report.overallStatus]}
          </span>
        ) : null}
      </div>

      {thread.report ? (
        <div className="space-y-3">
          {/* Headline + narrative */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            <p className="text-sm font-semibold text-[#eae8f2] leading-relaxed">
              {thread.report.headline}
            </p>
            <p className="text-xs text-white/45 mt-2 leading-relaxed">
              {thread.report.narrative}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-lg font-bold text-[#eae8f2] tabular-nums">
                {thread.report.messageCount}
              </p>
              <p className="text-[10px] text-white/25 mt-0.5">Messaggi</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <p className="text-lg font-bold text-[#eae8f2] tabular-nums">
                {thread.report.documentCount}
              </p>
              <p className="text-[10px] text-white/25 mt-0.5">Documenti</p>
            </div>
          </div>

          <ReportBlock title="Segnali chiave" items={thread.report.keySignals} />
          <ReportBlock title="Timeline recente" items={thread.report.timelineHighlights} />
          <ReportBlock title="Domande aperte" items={thread.report.openQuestions} />
          <ReportBlock title="Prossimi temi" items={thread.report.suggestedNextTopics} />
          <ReportBlock title="Cautele" items={thread.report.cautionNotes} tone="rose" />

          <p className="text-[10px] text-white/18 text-center pt-1">
            Aggiornato {formatDateTime(thread.report.generatedAt)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-xs text-white/30 max-w-[22ch] leading-relaxed">
            Il report nascerà da questa chat. Inizia a scrivere.
          </p>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────
   Report Block
───────────────────────────────────────── */

function ReportBlock({
  title,
  items,
  tone = 'default',
}: {
  title: string
  items: string[]
  tone?: 'default' | 'rose'
}) {
  if (!items.length) return null

  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <h4
        className={cn(
          'text-[10px] font-bold uppercase tracking-widest mb-2',
          tone === 'rose' ? 'text-[#f43f5e]/50' : 'text-white/25',
        )}
      >
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={`${title}-${item}`} className="flex items-start gap-2 text-xs text-white/50 leading-relaxed">
            <span
              className={cn(
                'w-1 h-1 rounded-full shrink-0 mt-1.5',
                tone === 'rose' ? 'bg-[#f43f5e]/40' : 'bg-white/20',
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─────────────────────────────────────────
   Documents Panel
───────────────────────────────────────── */

function DocumentsPanel({
  profile,
  thread,
}: {
  profile: PersonProfile
  thread: PersonThreadState
}) {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Archivio
          </p>
          <h3 className="text-sm font-bold text-[#eae8f2] mt-0.5">Doc di {profile.name}</h3>
        </div>
        <span className="text-xs font-bold text-white/30 tabular-nums">
          {thread.documents.length}
        </span>
      </div>

      {thread.documents.length > 0 ? (
        <div className="space-y-2">
          {[...thread.documents].reverse().map((doc) => (
            <article
              key={doc.id}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-[#eae8f2] line-clamp-1">{doc.filename}</p>
                <time className="text-[10px] text-white/20 shrink-0" dateTime={doc.uploadedAt}>
                  {formatDateTime(doc.uploadedAt)}
                </time>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{doc.summary}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/[0.06] text-white/35 border border-white/[0.07]">
                  {doc.documentType}
                </span>
                {doc.redFlags.length > 0 ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[rgba(244,63,94,0.1)] text-[#f43f5e] border border-[rgba(244,63,94,0.2)]">
                    {doc.redFlags.length} red flag
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-3">
            <FolderOpen className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-xs text-white/25">Nessun documento ancora caricato</p>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
