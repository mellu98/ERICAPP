import { useEffect, useState } from 'react'
import { ChatWorkspace } from './components/platform/ChatWorkspace'
import { PlatformShell } from './components/platform/PlatformShell'
import { createInitialThreadState, profiles } from './data/platformData'
import { fetchSituationReport, sendProfileChat } from './lib/api'
import type {
  ChatMessage,
  ChatPayloadMessage,
  DocumentRecord,
  PersonThreadState,
} from './types/platform'

const STORAGE_KEY = 'ericapp-family-chat-v2'

function App() {
  const [activeProfileId, setActiveProfileId] = useState(profiles[0].id)
  const [threads, setThreads] = useState<Record<string, PersonThreadState>>(
    () => loadThreads(),
  )
  const [uploadSignal, setUploadSignal] = useState(0)
  const [refreshSignal, setRefreshSignal] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  }, [threads])

  const activeProfile =
    profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0]
  const activeThread = threads[activeProfile.id] ?? createInitialThreadState()[activeProfile.id]

  const shellSections = profiles.map((profile) => {
    const thread = threads[profile.id] ?? createInitialThreadState()[profile.id]
    const latestAssistant = [...thread.messages]
      .reverse()
      .find((message) => message.role === 'assistant')
    const tone = latestAssistant?.cautionLevel === 'escalate'
      ? 'rose'
      : latestAssistant?.cautionLevel === 'watch'
        ? 'amber'
        : profile.tone

    return {
      id: profile.id,
      name: profile.name,
      subtitle: profile.subtitle,
      status: thread.report
        ? thread.report.headline
        : profile.status,
      tone,
      metric: `${thread.messages.length} msg | ${thread.documents.length} doc`,
      summary: profile.summary,
      unreadCount: thread.isSending ? 1 : undefined,
    }
  })

  async function handleSendMessage(payload: {
    text: string
    file?: File | null
  }) {
    const profile = activeProfile

    const userMessage: ChatMessage = {
      id: createId('user'),
      role: 'user',
      content: payload.text,
      createdAt: new Date().toISOString(),
    }

    // Capture the thread snapshot for the API call after the optimistic update
    let threadForApi: PersonThreadState | null = null

    setThreads((current) => {
      const prev = current[profile.id] ?? createInitialThreadState()[profile.id]
      const updated = {
        ...prev,
        messages: [...prev.messages, userMessage],
        isSending: true,
        error: null,
      }
      threadForApi = updated
      return { ...current, [profile.id]: updated }
    })

    try {
      const response = await sendProfileChat({
        profile: profile.name,
        message: payload.text,
        history: toPayloadMessages(threadForApi!.messages),
        documents: threadForApi!.documents,
        file: payload.file,
      })

      const documentRecord = response.attachment
        ? toDocumentRecord(response.attachment.snapshot)
        : null

      const assistantMessage: ChatMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: response.assistant.assistantMessage,
        createdAt: new Date().toISOString(),
        attachment: documentRecord ?? undefined,
        cautionLevel: response.assistant.cautionLevel,
        keySignals: response.assistant.keySignals,
        nextSteps: response.assistant.nextSteps,
      }

      setThreads((current) => {
        const prev = current[profile.id] ?? createInitialThreadState()[profile.id]
        return {
          ...current,
          [profile.id]: {
            ...prev,
            messages: [...prev.messages, assistantMessage],
            documents: documentRecord
              ? [...prev.documents, documentRecord]
              : prev.documents,
            isSending: false,
            error: null,
          },
        }
      })

      // Read the latest thread for the report refresh
      const latestThread = await new Promise<PersonThreadState>((resolve) => {
        setThreads((current) => {
          resolve(current[profile.id])
          return current
        })
      })

      await refreshReportForProfile(profile.id, latestThread)
    } catch (error) {
      setThreads((current) => {
        const prev = current[profile.id] ?? createInitialThreadState()[profile.id]
        return {
          ...current,
          [profile.id]: {
            ...prev,
            isSending: false,
            error: error instanceof Error ? error.message : 'Errore durante l invio.',
          },
        }
      })
    }
  }

  async function handleRefreshActiveProfile() {
    await refreshReportForProfile(activeProfile.id)
  }

  async function refreshReportForProfile(
    profileId: string,
    explicitThread?: PersonThreadState,
  ) {
    const profile = profiles.find((entry) => entry.id === profileId)

    if (!profile) {
      return
    }

    const thread = explicitThread ?? threads[profileId]

    if (!thread) {
      return
    }

    setThreads((current) => {
      const prev = current[profileId] ?? thread
      return {
        ...current,
        [profileId]: {
          ...prev,
          isRefreshingReport: true,
          error: null,
        },
      }
    })

    try {
      const report = await fetchSituationReport({
        profile: profile.name,
        history: toPayloadMessages(thread.messages),
        documents: thread.documents,
      })

      setThreads((current) => {
        const prev = current[profileId] ?? thread
        return {
          ...current,
          [profileId]: {
            ...prev,
            report,
            isRefreshingReport: false,
            error: null,
          },
        }
      })
    } catch (error) {
      setThreads((current) => {
        const prev = current[profileId] ?? thread
        return {
          ...current,
          [profileId]: {
            ...prev,
            isRefreshingReport: false,
            error: error instanceof Error ? error.message : 'Errore nel report.',
          },
        }
      })
    }
  }

  return (
    <PlatformShell
      appName="ERICAPP"
      appSubtitle="PWA familiare con 4 chatbot persona, upload documenti in chat e report dettagliato costruito dallo storico."
      sections={shellSections}
      activeSectionId={activeProfile.id}
      onSectionChange={setActiveProfileId}
      pwaState="installable"
      syncState={
        activeThread.isSending || activeThread.isRefreshingReport
          ? 'syncing'
          : 'ready'
      }
      connectionLabel="GPT-5.4 + parser documentale"
      syncLabel="Memoria privata per profilo"
      statusLabel={`${profiles.length} chatbot persona`}
      primaryActionLabel="Allega documento"
      secondaryActionLabel="Aggiorna report"
      onPrimaryAction={() => setUploadSignal((current) => current + 1)}
      onSecondaryAction={() => setRefreshSignal((current) => current + 1)}
    >
      <ChatWorkspace
        profile={activeProfile}
        thread={activeThread}
        uploadSignal={uploadSignal}
        refreshSignal={refreshSignal}
        onSendMessage={handleSendMessage}
        onRefreshReport={handleRefreshActiveProfile}
      />
    </PlatformShell>
  )
}

export default App

function loadThreads() {
  const initialState = createInitialThreadState()
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return initialState
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<PersonThreadState>>

    return Object.fromEntries(
      Object.entries(initialState).map(([profileId, fallbackThread]) => {
        const storedThread = parsed[profileId]

        if (!storedThread) {
          return [profileId, fallbackThread]
        }

        return [
          profileId,
          {
            messages: storedThread.messages ?? fallbackThread.messages,
            documents: storedThread.documents ?? fallbackThread.documents,
            report: storedThread.report ?? fallbackThread.report,
            isSending: false,
            isRefreshingReport: false,
            error: null,
          },
        ]
      }),
    )
  } catch {
    return initialState
  }
}

function toPayloadMessages(messages: ChatMessage[]): ChatPayloadMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  }))
}

function toDocumentRecord(document: Omit<DocumentRecord, 'id'>): DocumentRecord {
  return {
    ...document,
    id: createId('document'),
  }
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}
