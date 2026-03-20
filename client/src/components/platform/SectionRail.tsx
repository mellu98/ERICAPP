import type { PlatformSection } from './PlatformShell'

export type SectionRailProps = {
  sections: PlatformSection[]
  activeSectionId: string
  onSectionChange: (sectionId: string) => void
}

export function SectionRail({
  sections,
  activeSectionId,
  onSectionChange,
}: SectionRailProps) {
  return (
    <nav className="platform-rail" aria-label="Sezioni persone">
      <div className="platform-rail__header">
        <p className="platform-rail__eyebrow">Persone</p>
        <h2 className="platform-rail__title">4 spazi separati</h2>
        <p className="platform-rail__copy">
          Ogni persona ha un workspace proprio con documenti, chat e assistente AI.
        </p>
      </div>

      <div className="platform-rail__list" role="list">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId

          return (
            <button
              key={section.id}
              type="button"
              className={`platform-rail__item ${isActive ? 'is-active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="platform-rail__tone" data-tone={section.tone} />
              <span className="platform-rail__content">
                <strong>{section.name}</strong>
                <span>{section.subtitle}</span>
              </span>
              <span className="platform-rail__meta">
                <span>{section.status}</span>
                <small>{section.metric}</small>
                {section.unreadCount ? (
                  <strong>{section.unreadCount}</strong>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="platform-rail__footer">
        <span className="platform-rail__badge">PWA installabile</span>
        <span className="platform-rail__badge">Privacy per profilo</span>
        <span className="platform-rail__badge">AI separata per persona</span>
      </div>
    </nav>
  )
}
