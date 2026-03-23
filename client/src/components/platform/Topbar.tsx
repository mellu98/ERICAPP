import { Paperclip, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { PlatformPwaState, PlatformSectionTone, PlatformSyncState } from './PlatformShell'

export type TopbarProps = {
  appName: string
  activeSectionName: string
  activeSectionTone: PlatformSectionTone
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

const toneDotStyle: Record<PlatformSectionTone, string> = {
  teal: 'bg-[#00d4aa]',
  amber: 'bg-[#f5a623]',
  rose: 'bg-[#f43f5e]',
  slate: 'bg-white/30',
}

export function Topbar({
  connectionLabel,
  syncState,
  activeSectionName,
  activeSectionTone,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
}: TopbarProps) {
  const isSyncing = syncState === 'syncing'
  const isOffline = syncState === 'offline'

  return (
    <header
      className="flex items-center justify-between h-14 px-4 border-b border-white/[0.08] bg-[rgba(7,7,17,0.95)] backdrop-blur-xl shrink-0 z-20"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Left: identity */}
      <div className="flex items-center gap-3">
        {/* Logo — visible only on mobile (desktop shows it in sidebar) */}
        <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#007a62] flex items-center justify-center text-[#070711] font-black text-[13px] shadow-md shadow-[rgba(0,212,170,0.2)] shrink-0">
          ER
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', toneDotStyle[activeSectionTone])} />
            <p className="font-bold text-base text-[#eae8f2] leading-none">{activeSectionName}</p>
          </div>
          <p className="text-[12px] text-white/30 mt-1 hidden sm:block">{connectionLabel}</p>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-2.5">
        {/* Sync pill */}
        <span
          className={cn(
            'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors',
            isSyncing
              ? 'bg-[rgba(245,166,35,0.1)] text-[#f5a623] border-[rgba(245,166,35,0.2)]'
              : isOffline
                ? 'bg-[rgba(244,63,94,0.1)] text-[#f43f5e] border-[rgba(244,63,94,0.2)]'
                : 'bg-[rgba(0,212,170,0.07)] text-[#00d4aa] border-[rgba(0,212,170,0.16)]',
          )}
          aria-live="polite"
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isSyncing ? 'bg-[#f5a623] animate-pulse' : isOffline ? 'bg-[#f43f5e]' : 'bg-[#00d4aa]',
            )}
          />
          {isSyncing ? 'Elaborando...' : isOffline ? 'Offline' : 'Pronto'}
        </span>

        {/* Refresh report */}
        <button
          type="button"
          onClick={onSecondaryAction}
          disabled={!onSecondaryAction}
          title={secondaryActionLabel}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white/75 hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Upload */}
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={!onPrimaryAction}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#00d4aa] text-[#070711] text-sm font-bold hover:bg-[#00c49e] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[rgba(0,212,170,0.25)]"
        >
          <Paperclip className="w-4.5 h-4.5" />
          <span className="hidden sm:block">{primaryActionLabel}</span>
        </button>
      </div>
    </header>
  )
}
