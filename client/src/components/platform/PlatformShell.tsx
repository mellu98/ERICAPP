import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { SectionRail } from './SectionRail'
import { Topbar } from './Topbar'

export type PlatformSectionTone = 'teal' | 'amber' | 'rose' | 'slate'
export type PlatformPwaState = 'installed' | 'installable' | 'browser'
export type PlatformSyncState = 'ready' | 'syncing' | 'offline'

export type PlatformSection = {
  id: string
  name: string
  subtitle: string
  status: string
  tone: PlatformSectionTone
  metric: string
  summary: string
  unreadCount?: number
}

export type PlatformShellProps = {
  appName: string
  appSubtitle: string
  sections: PlatformSection[]
  activeSectionId: string
  onSectionChange: (sectionId: string) => void
  children: ReactNode
  pwaState?: PlatformPwaState
  syncState?: PlatformSyncState
  connectionLabel?: string
  syncLabel?: string
  statusLabel?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionLabel?: string
  secondaryActionLabel?: string
}

export function PlatformShell({
  appName,
  sections,
  activeSectionId,
  onSectionChange,
  children,
  pwaState = 'browser',
  syncState = 'ready',
  connectionLabel = 'Online',
  syncLabel = 'Sincronizzato',
  statusLabel = 'Pronto',
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = 'Allega documento',
  secondaryActionLabel = 'Aggiorna report',
}: PlatformShellProps) {
  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0]

  return (
    <div className="flex h-svh overflow-hidden bg-[#070711] text-[#eae8f2]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 border-r border-white/[0.07] bg-[rgba(7,7,17,0.97)]">
        <SectionRail
          sections={sections}
          activeSectionId={activeSectionId}
          onSectionChange={onSectionChange}
        />
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          appName={appName}
          activeSectionName={activeSection.name}
          activeSectionTone={activeSection.tone}
          syncState={syncState}
          pwaState={pwaState}
          connectionLabel={connectionLabel}
          statusLabel={statusLabel}
          syncLabel={syncLabel}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
          primaryActionLabel={primaryActionLabel}
          secondaryActionLabel={secondaryActionLabel}
        />

        <main className="flex-1 min-h-0 overflow-hidden">
          {children}
        </main>

        <BottomNav
          sections={sections}
          activeSectionId={activeSectionId}
          onSectionChange={onSectionChange}
        />
      </div>
    </div>
  )
}
