import type { ReactNode } from 'react'
import type { PlatformSection, Tone } from '../../types/platform'

export type WorkspaceTone = Tone

export type PersonWorkspaceProps = {
  section: PlatformSection
  footerSlot?: ReactNode
}

const toneClass: Record<Tone | 'slate', string> = {
  teal: 'is-teal',
  amber: 'is-amber',
  rose: 'is-rose',
  slate: 'is-slate',
}

export function PersonWorkspace({
  section,
  footerSlot,
}: PersonWorkspaceProps) {
  return (
    <section className={`platform-workspace ${toneClass[section.statusTone]}`}>
      <header className="platform-workspace__hero">
        <div className="platform-workspace__hero-copy">
          <p className="platform-eyebrow">Workspace persona</p>
          <h2>{section.name}</h2>
          <p className="platform-subtitle">{section.subtitle}</p>
        </div>

        <div className="platform-workspace__hero-meta">
          <span className="platform-status">{section.status}</span>
          <span className="platform-updated">Updated {section.lastUpdate}</span>
        </div>
      </header>

      <div className="platform-workspace__body">
        <article className="platform-workspace__panel platform-workspace__panel--focus">
          <p className="platform-kicker">Overview</p>
          <h3>{section.summary}</h3>
          <p className="platform-copy">{section.observation}</p>

          <div className="platform-metric-grid">
            {section.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`platform-metric ${toneClass[metric.tone]}`}
              >
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <aside className="platform-workspace__panel platform-workspace__panel--signals">
          <p className="platform-kicker">Signals</p>
          <div className="platform-signal-stack">
            {section.workspaces.map((signal) => (
              <div
                key={signal.label}
                className={`platform-signal ${toneClass[signal.tone]}`}
              >
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <p>{signal.note}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className="platform-workspace__footer">
        <article className="platform-workspace__panel platform-workspace__panel--action">
          <p className="platform-kicker">Next action</p>
          <p className="platform-copy">{section.nextStep}</p>
        </article>

        <article className="platform-workspace__panel platform-workspace__panel--timeline">
          <p className="platform-kicker">Recent activity</p>
          <ol className="platform-timeline">
            {section.timeline.map((item) => (
              <li key={`${item.time}-${item.title}`}>
                <span>{item.time}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        {footerSlot ? <div className="platform-workspace__slot">{footerSlot}</div> : null}
      </footer>
    </section>
  )
}

export default PersonWorkspace
