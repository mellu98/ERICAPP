import { cn } from '../../lib/utils'
import type { PlatformSection, PlatformSectionTone } from './PlatformShell'

const toneActiveStyles: Record<PlatformSectionTone, string> = {
  teal: 'text-[#00d4aa] border-[rgba(0,212,170,0.3)] bg-[rgba(0,212,170,0.1)]',
  amber: 'text-[#f5a623] border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.1)]',
  rose: 'text-[#f43f5e] border-[rgba(244,63,94,0.3)] bg-[rgba(244,63,94,0.1)]',
  slate: 'text-white/60 border-white/[0.15] bg-white/[0.05]',
}

const toneLabelStyles: Record<PlatformSectionTone, string> = {
  teal: 'text-[#00d4aa]',
  amber: 'text-[#f5a623]',
  rose: 'text-[#f43f5e]',
  slate: 'text-white/40',
}

export type BottomNavProps = {
  sections: PlatformSection[]
  activeSectionId: string
  onSectionChange: (id: string) => void
}

export function BottomNav({ sections, activeSectionId, onSectionChange }: BottomNavProps) {
  return (
    <nav
      className="md:hidden flex items-center border-t border-white/[0.08] bg-[rgba(7,7,17,0.97)] backdrop-blur-xl shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Profili"
    >
      {sections.map((section) => {
        const isActive = section.id === activeSectionId

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-150 active:scale-95"
          >
            <div className="relative">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all duration-200',
                  isActive
                    ? toneActiveStyles[section.tone]
                    : 'text-white/25 border-white/[0.06] bg-transparent',
                )}
              >
                {section.name[0]}
              </div>
              {section.unreadCount ? (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00d4aa] border border-[#070711]" />
              ) : null}
            </div>
            <span
              className={cn(
                'text-[9px] font-bold tracking-wide transition-colors',
                isActive ? toneLabelStyles[section.tone] : 'text-white/20',
              )}
            >
              {section.name}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
