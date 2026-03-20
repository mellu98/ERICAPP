import type { ReactNode } from 'react'
import type { PlatformPwaState, PlatformSyncState } from './PlatformShell'

export type TopbarAction = {
  label: string
  onClick?: () => void
  icon?: ReactNode
  tone?: 'primary' | 'secondary'
}

export type TopbarProps = {
  appName: string
  appSubtitle: string
  activeSectionName: string
  connectionLabel: string
  pwaState: PlatformPwaState
  syncState: PlatformSyncState
  statusLabel: string
  syncLabel: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionLabel: string
  secondaryActionLabel: string
}

const pwaLabelMap: Record<PlatformPwaState, string> = {
  installed: 'Installata',
  installable: 'Installabile',
  browser: 'Nel browser',
}

const syncLabelMap: Record<PlatformSyncState, string> = {
  ready: 'Sincronizzata',
  syncing: 'Sincronizzazione',
  offline: 'Offline',
}

export function Topbar({
  appName,
  appSubtitle,
  activeSectionName,
  connectionLabel,
  pwaState,
  syncState,
  statusLabel,
  syncLabel,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
}: TopbarProps) {
  return (
    <header className="platform-topbar">
      <div className="platform-topbar__identity">
        <div className="platform-topbar__brand">
          <span className="platform-topbar__logo" aria-hidden="true">
            ER
          </span>
          <div>
            <p className="platform-topbar__eyebrow">Family health platform</p>
            <h1 className="platform-topbar__title">{appName}</h1>
          </div>
        </div>
        <p className="platform-topbar__subtitle">{appSubtitle}</p>
      </div>

      <div className="platform-topbar__center">
        <span className="platform-topbar__crumb">Sezione attiva</span>
        <strong className="platform-topbar__section">{activeSectionName}</strong>
        <p className="platform-topbar__sectionNote">
          {statusLabel} - {syncLabel}
        </p>
      </div>

      <div className="platform-topbar__right">
        <div className="platform-topbar__statusRow" aria-live="polite">
          <span className="platform-topbar__status" data-tone="slate">
            {connectionLabel}
          </span>
          <span className="platform-topbar__status" data-tone={pwaState}>
            {pwaLabelMap[pwaState]}
          </span>
          <span className="platform-topbar__status" data-tone={syncState}>
            {syncLabelMap[syncState]}
          </span>
        </div>

        <div className="platform-topbar__actions">
          <button
            type="button"
            className="platform-topbar__button is-secondary"
            onClick={onSecondaryAction}
            disabled={!onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
          <button
            type="button"
            className="platform-topbar__button is-primary"
            onClick={onPrimaryAction}
            disabled={!onPrimaryAction}
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </header>
  )
}
