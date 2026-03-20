import { useState } from 'react'
import { AssistantGrid } from './components/platform/AssistantGrid'
import { PersonWorkspace } from './components/platform/PersonWorkspace'
import { PlatformShell } from './components/platform/PlatformShell'
import { RecordsDeck } from './components/platform/RecordsDeck'
import { platformSummary, sections, specialists } from './data/platformData'

function App() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id)

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0]

  const shellSections = sections.map((section) => ({
    id: section.id,
    name: section.name,
    subtitle: section.subtitle,
    status: section.status,
    tone: section.statusTone,
    metric: `${section.documents.length} docs`,
    summary: section.summary,
    unreadCount: section.statusTone === 'rose' ? 1 : undefined,
  }))

  const assistantCards = specialists.map((assistant) => ({
    ...assistant,
    focus: assistant.focus ?? assistant.eyebrow,
    guardrail: assistant.guardrail ?? assistant.limit,
  }))

  return (
    <PlatformShell
      appName="ERICAPP"
      appSubtitle="Piattaforma PWA familiare con 4 sezioni persona, parser documentale e assistenti AI separati per profilo."
      sections={shellSections}
      activeSectionId={activeSection.id}
      onSectionChange={setActiveSectionId}
      pwaState="installable"
      syncState="ready"
      connectionLabel={platformSummary.parserStatus}
      syncLabel="Sync privata attiva"
      statusLabel={`${platformSummary.sectionCount} workspace persona`}
      primaryActionLabel="Nuovo documento"
      secondaryActionLabel="Apri chat AI"
    >
      <div className="platform-shell__stack">
        <PersonWorkspace
          section={activeSection}
          footerSlot={
            <RecordsDeck
              section={activeSection}
              uploadHint={`Uploads, referti e chat restano isolati dentro la sezione ${activeSection.name}.`}
            />
          }
        />

        <AssistantGrid
          title={`Assistenti specialisti per ${activeSection.name}`}
          assistants={assistantCards}
          activePersonId={activeSection.id}
        />
      </div>
    </PlatformShell>
  )
}

export default App
