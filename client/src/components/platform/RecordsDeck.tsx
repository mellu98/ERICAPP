import type { PlatformSection, Tone } from '../../types/platform'

export type RecordsDeckProps = {
  section: PlatformSection
  uploadHint: string
}

const toneClass: Record<Tone, string> = {
  teal: 'is-teal',
  amber: 'is-amber',
  rose: 'is-rose',
}

export function RecordsDeck({
  section,
  uploadHint,
}: RecordsDeckProps) {
  const chatLines = [
    {
      speaker: section.chat.assistantName,
      body: section.chat.latestMessage,
      time: section.lastUpdate,
      kind: 'assistant' as const,
    },
    {
      speaker: 'Caregiver',
      body: section.chat.nextAction,
      time: 'Now',
      kind: 'user' as const,
    },
  ]

  return (
    <section className="platform-deck">
      <header className="platform-deck__header">
        <div>
          <p className="platform-eyebrow">Records deck</p>
          <h3>{section.name}</h3>
        </div>
        <p className="platform-deck__hint">{uploadHint}</p>
      </header>

      <div className="platform-deck__grid">
        <article className="platform-deck__card">
          <p className="platform-kicker">Exams</p>
          <div className="platform-record-list">
            {section.documents.map((item) => (
              <div
                key={`${item.title}-${item.date}`}
                className={`platform-record ${toneClass[section.statusTone]}`}
              >
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.kind}</p>
                </div>
                <span>{item.date}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-deck__card">
          <p className="platform-kicker">Documents archive</p>
          <div className="platform-record-list">
            {section.timeline.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className={`platform-record ${toneClass[section.statusTone]}`}
              >
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-deck__card platform-deck__card--chat">
          <p className="platform-kicker">Private chat</p>
          <h4>{section.chat.assistantName}</h4>
          <p className="platform-copy">{section.chat.status}</p>
          <div className="platform-chat-stack">
            {chatLines.map((line) => (
              <div
                key={`${line.time}-${line.speaker}`}
                className={`platform-chat-line kind-${line.kind ?? 'assistant'}`}
              >
                <div className="platform-chat-line__meta">
                  <strong>{line.speaker}</strong>
                  <span>{line.time}</span>
                </div>
                <p>{line.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="platform-deck__card platform-deck__card--ai">
          <p className="platform-kicker">Personal AI</p>
          <h4>Assistant summary</h4>
          <p className="platform-copy">{section.observation}</p>
        </article>
      </div>
    </section>
  )
}

export default RecordsDeck
