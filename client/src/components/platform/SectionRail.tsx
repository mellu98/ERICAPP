import { cn } from '../../lib/utils'
import type { PlatformSection, PlatformSectionTone } from './PlatformShell'

export type SectionRailProps = {
  sections: PlatformSection[]
  activeSectionId: string
  onSectionChange: (sectionId: string) => void
}

const toneDotClass: Record<PlatformSectionTone, string> = {
  teal: 'bg-[#00d4aa]',
  amber: 'bg-[#f5a623]',
  rose: 'bg-[#f43f5e]',
  slate: 'bg-white/30',
}

export function SectionRail({ sections, activeSectionId, onSectionChange }: SectionRailProps) {
  return (
    <nav className="flex flex-col h-full py-4" aria-label="Sezioni persone">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 pb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#007a62] flex items-center justify-center text-[#070711] font-black text-xs tracking-wide shrink-0 shadow-lg shadow-[rgba(0,212,170,0.2)]">
          ER
        </div>
        <div>
          <p className="font-bold text-sm text-[#eae8f2] leading-none">ERICAPP</p>
          <p className="text-[11px] text-white/35 mt-0.5">Monitoraggio famiglia</p>
        </div>
      </div>

      {/* Section label */}
      <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
        Persone
      </p>

      {/* Profile list */}
      <div className="flex flex-col gap-0.5 px-2 flex-1 overflow-y-auto">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150 group',
                isActive
                  ? 'bg-[rgba(0,212,170,0.08)] border border-[rgba(0,212,170,0.2)]'
                  : 'hover:bg-white/[0.04] border border-transparent',
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0 transition-all',
                  toneDotClass[section.tone],
                  !isActive && 'opacity-60',
                )}
              />
              <span className="flex-1 min-w-0">
                <span
                  className={cn(
                    'block text-sm font-semibold truncate transition-colors',
                    isActive ? 'text-[#eae8f2]' : 'text-white/60 group-hover:text-white/85',
                  )}
                >
                  {section.name}
                </span>
                <span className="block text-[11px] text-white/30 truncate mt-0.5 leading-none">
                  {section.subtitle}
                </span>
              </span>
              {section.unreadCount ? (
                <span className="w-4 h-4 rounded-full bg-[#00d4aa] text-[#070711] text-[9px] font-black flex items-center justify-center shrink-0">
                  {section.unreadCount}
                </span>
              ) : (
                <span className="text-[10px] text-white/20 tabular-nums shrink-0">
                  {section.metric.split(' | ')[0]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pt-4 border-t border-white/[0.06] mt-4 shrink-0">
        <p className="text-[10px] text-white/20 leading-relaxed">
          PWA · Privacy per profilo
          <br />
          AI separata · GPT-5.4
        </p>
      </div>
    </nav>
  )
}
