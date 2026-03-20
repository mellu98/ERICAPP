import type { SpecialistAssistant, Tone } from '../../types/platform'

export type AssistantGridProps = {
  title: string
  eyebrow?: string
  assistants: SpecialistAssistant[]
  activePersonId: string
}

const toneClass: Record<Tone, string> = {
  teal: 'is-teal',
  amber: 'is-amber',
  rose: 'is-rose',
}

export function AssistantGrid({
  title,
  eyebrow = 'Assistant stack',
  assistants,
  activePersonId,
}: AssistantGridProps) {
  return (
    <section className="platform-assistants">
      <header className="platform-assistants__header">
        <div>
          <p className="platform-eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <p className="platform-assistants__hint">
          Each assistant has a distinct job, a distinct prompt boundary, and a distinct handoff.
        </p>
      </header>

      <div className="platform-assistants__grid">
        {assistants.map((assistant) => (
          <article
            key={assistant.name}
            className={`platform-assistant-card ${toneClass['teal']}`}
          >
            <div className="platform-assistant-card__header">
              <div>
                <span className="platform-kicker">{assistant.focus}</span>
                <h4>{assistant.name}</h4>
              </div>
              <span className="platform-assistant-card__role">{assistant.role}</span>
            </div>

            <div className="platform-assistant-card__block">
              <p className="platform-label">Asks</p>
              <p>{assistant.asks}</p>
            </div>

            <div className="platform-assistant-card__block">
              <p className="platform-label">Output</p>
              <p>{assistant.messages[activePersonId]}</p>
            </div>

            <div className="platform-assistant-card__block">
              <p className="platform-label">Guardrail</p>
              <p>{assistant.guardrail}</p>
            </div>

            <div className="platform-assistant-card__block">
              <p className="platform-label">Handoff</p>
              <p>{assistant.handoff}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AssistantGrid
