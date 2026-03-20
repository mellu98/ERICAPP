import type { ReactNode } from 'react'
import { SectionRail } from './SectionRail'
import { Topbar } from './Topbar'

export type PlatformSectionTone = 'teal' | 'amber' | 'rose' | 'slate'

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

export type PlatformPwaState = 'installed' | 'installable' | 'browser'
export type PlatformSyncState = 'ready' | 'syncing' | 'offline'

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

const shellStyles = `
.platform-shell {
  min-height: 100svh;
  padding: 18px;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(57, 151, 137, 0.18), transparent 30%),
    radial-gradient(circle at top right, rgba(185, 74, 72, 0.12), transparent 28%),
    linear-gradient(180deg, #f4ecdf 0%, #ede3d3 100%);
}

.platform-shell__surface {
  display: grid;
  gap: 18px;
  min-height: calc(100svh - 36px);
}

.platform-topbar {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.65fr) minmax(320px, 1fr);
  gap: 16px;
  align-items: center;
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: rgba(255, 252, 246, 0.9);
  box-shadow: 0 18px 40px rgba(31, 36, 48, 0.08);
}

.platform-topbar__brand {
  display: flex;
  gap: 14px;
  align-items: center;
}

.platform-topbar__logo {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: var(--paper);
  background: linear-gradient(135deg, var(--ink), var(--teal-strong));
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 14px 22px rgba(31, 36, 48, 0.18);
}

.platform-topbar__eyebrow,
.platform-rail__eyebrow {
  margin: 0;
  color: var(--teal-deep);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 800;
}

.platform-topbar__title {
  margin: 3px 0 0;
  font-family: var(--heading);
  font-size: 1.45rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

.platform-topbar__subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  max-width: 42ch;
}

.platform-topbar__center {
  justify-self: center;
  padding-inline: 8px;
}

.platform-topbar__crumb {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.platform-topbar__section {
  display: block;
  margin-top: 4px;
  font-size: 1.1rem;
}

.platform-topbar__sectionNote {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.platform-topbar__right {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.platform-topbar__statusRow {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.platform-topbar__status {
  display: inline-flex;
  align-items: center;
  padding: 0.42rem 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(31, 36, 48, 0.08);
  background: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  font-weight: 700;
}

.platform-topbar__status[data-tone='installed'],
.platform-topbar__status[data-tone='ready'] {
  background: rgba(217, 240, 234, 0.9);
}

.platform-topbar__status[data-tone='installable'],
.platform-topbar__status[data-tone='syncing'] {
  background: rgba(248, 228, 203, 0.92);
}

.platform-topbar__status[data-tone='browser'],
.platform-topbar__status[data-tone='offline'],
.platform-topbar__status[data-tone='slate'] {
  background: rgba(226, 231, 237, 0.9);
}

.platform-topbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.platform-topbar__button {
  border: 1px solid rgba(31, 36, 48, 0.1);
  border-radius: 999px;
  padding: 0.8rem 1rem;
  font-weight: 800;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;
}

.platform-topbar__button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(31, 36, 48, 0.12);
}

.platform-topbar__button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.platform-topbar__button.is-primary {
  color: var(--paper);
  background: var(--ink);
}

.platform-topbar__button.is-secondary {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.72);
}

.platform-rail {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: rgba(255, 252, 246, 0.86);
  box-shadow: 0 18px 40px rgba(31, 36, 48, 0.06);
}

.platform-rail__title {
  margin: 4px 0 0;
  font-family: var(--heading);
  font-size: 1.45rem;
  letter-spacing: -0.04em;
}

.platform-rail__copy {
  margin: 8px 0 0;
  color: var(--muted);
}

.platform-rail__list {
  display: grid;
  gap: 10px;
}

.platform-rail__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(31, 36, 48, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.platform-rail__item:hover {
  transform: translateY(-1px);
  border-color: rgba(45, 125, 115, 0.3);
}

.platform-rail__item.is-active {
  background: rgba(217, 240, 234, 0.9);
  border-color: rgba(45, 125, 115, 0.34);
}

.platform-rail__tone {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--teal-strong);
}

.platform-rail__tone[data-tone='amber'] { background: var(--amber-strong); }
.platform-rail__tone[data-tone='rose'] { background: var(--rose-strong); }
.platform-rail__tone[data-tone='slate'] { background: #5f6b7a; }

.platform-rail__content {
  display: grid;
  gap: 3px;
}

.platform-rail__content strong {
  color: var(--ink);
}

.platform-rail__content span,
.platform-rail__meta span,
.platform-rail__meta small {
  color: var(--muted);
}

.platform-rail__meta {
  display: grid;
  justify-items: end;
  gap: 4px;
}

.platform-rail__badge {
  display: inline-flex;
  width: fit-content;
  padding: 0.42rem 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(31, 36, 48, 0.08);
  background: rgba(255, 252, 246, 0.92);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 700;
}

.platform-rail__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.platform-shell__frame {
  display: grid;
  grid-template-columns: minmax(280px, 332px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.platform-shell__rail {
  position: sticky;
  top: 18px;
  align-self: start;
}

.platform-shell__workspace {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.platform-shell__hero {
  display: grid;
  gap: 10px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 30px;
  background: rgba(255, 252, 246, 0.82);
  box-shadow: 0 18px 40px rgba(31, 36, 48, 0.08);
}

.platform-shell__heroTitle {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
}

.platform-shell__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--teal-deep);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 800;
}

.platform-shell__title {
  margin: 0;
  font-family: var(--heading);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.platform-shell__subtitle {
  margin: 0;
  color: var(--muted);
  max-width: 68ch;
}

.platform-shell__heroMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.platform-shell__chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.52rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(31, 36, 48, 0.08);
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.92rem;
  font-weight: 700;
}

.platform-shell__chip[data-tone='teal'] { background: rgba(217, 240, 234, 0.78); }
.platform-shell__chip[data-tone='amber'] { background: rgba(248, 228, 203, 0.84); }
.platform-shell__chip[data-tone='rose'] { background: rgba(247, 217, 213, 0.82); }
.platform-shell__chip[data-tone='slate'] { background: rgba(226, 231, 237, 0.85); }

.platform-shell__main {
  display: grid;
  min-width: 0;
}

.platform-shell__panel {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 30px;
  background: rgba(255, 252, 246, 0.78);
  box-shadow: 0 18px 40px rgba(31, 36, 48, 0.06);
}

.platform-shell__panelHeader {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: end;
  margin-bottom: 18px;
}

.platform-shell__panelLabel {
  margin: 0;
  color: var(--teal-deep);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 800;
}

.platform-shell__panelTitle {
  margin: 4px 0 0;
  font-family: var(--heading);
  font-size: 1.7rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

.platform-shell__panelBody {
  min-width: 0;
}

@media (max-width: 1080px) {
  .platform-topbar {
    grid-template-columns: 1fr;
  }

  .platform-topbar__center,
  .platform-topbar__right {
    justify-self: stretch;
  }

  .platform-topbar__right {
    justify-items: start;
  }

  .platform-topbar__statusRow {
    justify-content: flex-start;
  }

  .platform-shell__frame {
    grid-template-columns: 1fr;
  }

  .platform-shell__rail {
    position: static;
  }
}

@media (max-width: 720px) {
  .platform-shell {
    padding: 12px;
  }

  .platform-topbar__actions {
    width: 100%;
  }

  .platform-topbar__button {
    flex: 1 1 0;
  }

  .platform-rail__list {
    display: flex;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .platform-rail__item {
    min-width: 270px;
  }

  .platform-shell__surface {
    min-height: calc(100svh - 24px);
  }

  .platform-shell__hero,
  .platform-shell__panel {
    padding: 18px;
    border-radius: 24px;
  }
}
`

export function PlatformShell({
  appName,
  appSubtitle,
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
  primaryActionLabel = 'Nuovo upload',
  secondaryActionLabel = 'Nuovo check-in',
}: PlatformShellProps) {
  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0]

  return (
    <div className="platform-shell">
      <style>{shellStyles}</style>
      <div className="platform-shell__surface">
        <Topbar
          appName={appName}
          appSubtitle={appSubtitle}
          activeSectionName={activeSection.name}
          connectionLabel={connectionLabel}
          pwaState={pwaState}
          syncState={syncState}
          statusLabel={statusLabel}
          syncLabel={syncLabel}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
          primaryActionLabel={primaryActionLabel}
          secondaryActionLabel={secondaryActionLabel}
        />

        <div className="platform-shell__frame">
          <aside className="platform-shell__rail">
            <SectionRail
              sections={sections}
              activeSectionId={activeSectionId}
              onSectionChange={onSectionChange}
            />
          </aside>

          <main className="platform-shell__workspace">
            <section className="platform-shell__hero">
              <div className="platform-shell__heroTitle">
                <span className="platform-shell__eyebrow">Workspace attivo</span>
                <h1 className="platform-shell__title">{activeSection.name}</h1>
              </div>
              <p className="platform-shell__subtitle">{activeSection.subtitle}</p>
              <div className="platform-shell__heroMeta" aria-label="Stato piattaforma">
                <span className="platform-shell__chip" data-tone={activeSection.tone}>
                  {activeSection.status}
                </span>
                <span className="platform-shell__chip" data-tone="slate">
                  {activeSection.metric}
                </span>
                <span className="platform-shell__chip" data-tone="slate">
                  {connectionLabel}
                </span>
              </div>
            </section>

            <section className="platform-shell__panel">
              <div className="platform-shell__panelHeader">
                <div>
                  <p className="platform-shell__panelLabel">Contenuto sezione</p>
                  <h2 className="platform-shell__panelTitle">
                    {activeSection.summary}
                  </h2>
                </div>
                <span className="platform-shell__chip" data-tone="teal">
                  {syncLabel}
                </span>
              </div>
              <div className="platform-shell__panelBody">{children}</div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
