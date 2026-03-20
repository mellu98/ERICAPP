import { useState } from 'react'
import './App.css'

type Tone = 'teal' | 'amber' | 'rose'

type Metric = {
  label: string
  value: string
  tone: Tone
}

type TimelineEntry = {
  time: string
  title: string
  note: string
}

type FamilyMember = {
  id: string
  name: string
  relationship: string
  status: string
  statusTone: Tone
  lastCheckIn: string
  summary: string
  nextStep: string
  observation: string
  metrics: Metric[]
  timeline: TimelineEntry[]
}

type AssistantCard = {
  name: string
  eyebrow: string
  role: string
  asks: string
  limit: string
  handoff: string
  messages: Record<string, string>
}

const familyMembers: FamilyMember[] = [
  {
    id: 'elisa',
    name: 'Elisa',
    relationship: 'Nonna, 78 anni',
    status: 'Da seguire con calma',
    statusTone: 'amber',
    lastCheckIn: '20 min fa',
    summary:
      'Oggi appare piu stanca del solito: sonno breve, appetito ridotto e lieve calo di energia.',
    nextStep:
      'Osservare cena, idratazione e livello di stanchezza questa sera. Se peggiora in fretta o compaiono red flag, contattare subito un professionista.',
    observation:
      'La famiglia ha segnato due giorni con sonno discontinuo. L app suggerisce continuita di osservazione, non conclusioni cliniche.',
    metrics: [
      { label: 'Sonno', value: '5h 40m', tone: 'amber' },
      { label: 'Energia', value: '5/10', tone: 'amber' },
      { label: 'Appetito', value: 'Basso', tone: 'amber' },
      { label: 'Idratazione', value: 'Buona', tone: 'teal' },
    ],
    timeline: [
      {
        time: '21:10',
        title: 'Check-in serale completato',
        note: 'Segnalati sonno leggero e cena ridotta rispetto al solito.',
      },
      {
        time: '16:30',
        title: 'Promemoria acqua confermato',
        note: 'La caregiver ha registrato due bicchieri e una passeggiata breve.',
      },
      {
        time: '09:00',
        title: 'Care Compass ha notato un trend',
        note: 'Energia in lieve calo da 3 giorni, senza red flag dichiarati.',
      },
    ],
  },
  {
    id: 'tommaso',
    name: 'Tommaso',
    relationship: 'Figlio, 11 anni',
    status: 'Stabile ma da osservare',
    statusTone: 'teal',
    lastCheckIn: '1 h fa',
    summary:
      'Oggi la routine e quasi normale: lieve febbricola serale, appetito presente e buon livello di gioco.',
    nextStep:
      'Ripetere il check-in domani mattina e segnare eventuali cambi rapidi di febbre, sonnolenza o respiro.',
    observation:
      'Qui il valore vero e il confronto nel tempo: la famiglia vede subito se il quadro resta lieve o cambia direzione.',
    metrics: [
      { label: 'Temperatura', value: '37.4 C', tone: 'teal' },
      { label: 'Energia', value: '7/10', tone: 'teal' },
      { label: 'Appetito', value: 'Normale', tone: 'teal' },
      { label: 'Umore', value: 'Sereno', tone: 'teal' },
    ],
    timeline: [
      {
        time: '19:40',
        title: 'Check-in rapido con la mamma',
        note: 'Temperatura inserita manualmente e appetito confermato normale.',
      },
      {
        time: '13:15',
        title: 'Family Care Planner ha preparato il promemoria',
        note: 'Domani mattina ricordare misurazione e nota su energia.',
      },
      {
        time: '08:20',
        title: 'Routine scuola registrata',
        note: 'Notte regolare e nessuna lamentela respiratoria.',
      },
    ],
  },
  {
    id: 'luca',
    name: 'Luca',
    relationship: 'Papa, 54 anni',
    status: 'Escalation prudente',
    statusTone: 'rose',
    lastCheckIn: '12 min fa',
    summary:
      'Nel check-in sono comparsi dolore forte improvviso e capogiro dopo una caduta: la conversazione normale va fermata.',
    nextStep:
      'Signal Triage deve mostrare solo un invito chiaro a cercare assistenza umana urgente e preparare un riepilogo rapido dei sintomi.',
    observation:
      'Questo e l esempio del confine piu importante del prodotto: l app non interpreta, non rassicura e non ritarda l aiuto.',
    metrics: [
      { label: 'Dolore', value: 'Forte', tone: 'rose' },
      { label: 'Capogiro', value: 'Presente', tone: 'rose' },
      { label: 'Respiro', value: 'Da chiarire', tone: 'amber' },
      { label: 'Ultimo evento', value: 'Caduta', tone: 'rose' },
    ],
    timeline: [
      {
        time: '22:18',
        title: 'Signal Triage ha bloccato il flusso',
        note: 'La UI deve mostrare solo messaggio di emergenza e riepilogo condivisibile.',
      },
      {
        time: '22:15',
        title: 'Nota libera della famiglia',
        note: 'Segnalati dolore improvviso, capogiro e bisogno di supporto immediato.',
      },
      {
        time: '22:10',
        title: 'Check-in iniziato',
        note: 'Il sistema ha rilevato combinazione di segnali non compatibile con un consiglio generico.',
      },
    ],
  },
]

const assistantCards: AssistantCard[] = [
  {
    name: 'Care Compass',
    eyebrow: 'Monitoraggio quotidiano',
    role:
      'Tiene insieme sonno, energia, appetito, umore e routine per mostrare trend semplici e comprensibili.',
    asks:
      'Sonno, energia, idratazione, appetito, umore e una nota libera sul contesto.',
    limit:
      'Non fa diagnosi, non interpreta un singolo valore isolato e non tranquillizza quando i dati sono incompleti.',
    handoff:
      'Se nota un cambio netto o ambiguo passa solo il contesto minimo a Signal Triage.',
    messages: {
      elisa:
        'Vedo sonno in calo e appetito piu basso del solito da 3 giorni. Posso continuare a monitorare e preparare un riepilogo ordinato per la visita.',
      tommaso:
        'Oggi il quadro resta lieve e abbastanza stabile. Teniamo una nuova misurazione domani mattina per capire se la febbre sale o si spegne.',
      luca:
        'I dati di routine non bastano piu: serve interrompere il monitoraggio standard e passare subito la mano a Signal Triage.',
    },
  },
  {
    name: 'Signal Triage',
    eyebrow: 'Segnali da non ignorare',
    role:
      'Valuta in modo prudente i cambiamenti dichiarati e decide se monitorare, contattare un professionista o cercare assistenza urgente.',
    asks:
      'Problema principale, da quanto dura, intensita, andamento e segnali associati da non trascurare.',
    limit:
      'Non differenzia malattie, non modifica terapie e non invita mai ad aspettare quando emergono red flag.',
    handoff:
      'Quando il livello e chiaro, consegna a Family Care Planner solo urgenza, sintomi e prossima azione.',
    messages: {
      elisa:
        'Qui non vedo red flag immediati, ma suggerisco osservazione attiva e contatto con un professionista se appetito e lucidita peggiorano rapidamente.',
      tommaso:
        'Per ora siamo nel livello monitorare. Se compaiono difficolta respiratoria, sonnolenza marcata o febbre alta persistente, il tono dell app deve cambiare subito.',
      luca:
        'Dolore forte improvviso piu capogiro dopo una caduta richiedono assistenza umana urgente. Posso solo riassumere i sintomi per chi deve intervenire.',
    },
  },
  {
    name: 'Family Care Planner',
    eyebrow: 'Coordinamento familiare',
    role:
      'Trasforma osservazioni e livelli di attenzione in promemoria, riepiloghi condivisibili e continuita tra i familiari.',
    asks:
      'Chi deve fare cosa, entro quando, e quale riepilogo serve alla famiglia o a un professionista.',
    limit:
      'Non prende decisioni cliniche autonome e non riscrive indicazioni che arrivano da un medico.',
    handoff:
      'Chiude il cerchio con una memoria semplice: dati, contesto, urgenza e prossima azione.',
    messages: {
      elisa:
        'Ho preparato tre promemoria semplici: cena leggera, nota su idratazione e confronto del livello di energia domani mattina.',
      tommaso:
        'Posso trasformare il check-in di oggi in un riepilogo corto da tenere pronto se domani i sintomi cambiano.',
      luca:
        'Preparo solo un messaggio essenziale con sintomi, orario e dinamica della caduta, senza aggiungere interpretazioni.',
    },
  },
]

const redFlags = [
  'difficolta respiratoria o labbra blu',
  'dolore forte o improvviso al petto',
  'perdita di coscienza, convulsioni o confusione marcata',
  'sanguinamento importante o trauma serio',
  'idea di farsi del male o rischio immediato per una persona fragile',
]

const privacyPillars = [
  {
    title: 'Consenso per ogni profilo',
    copy:
      'Ogni persona monitorata deve avere un consenso chiaro, revocabile e separato dagli altri familiari.',
  },
  {
    title: 'Solo il minimo necessario',
    copy:
      'L app chiede pochi dati alla volta e non deve usare note sensibili per marketing o log in chiaro.',
  },
  {
    title: 'Condivisione tracciabile',
    copy:
      'Ogni accesso, export o modifica importante va reso visibile alla famiglia con una storia semplice da capire.',
  },
]

function App() {
  const [activeMemberId, setActiveMemberId] = useState(familyMembers[0].id)

  const activeMember =
    familyMembers.find((member) => member.id === activeMemberId) ??
    familyMembers[0]

  const attentionCount = familyMembers.filter(
    (member) => member.statusTone !== 'teal',
  ).length
  const urgentMember = familyMembers.find(
    (member) => member.statusTone === 'rose',
  )

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Prototype caregiver wellness app</p>
          <h1>Seguire chi ami con piu contesto, meno ansia e confini sicuri.</h1>
          <p className="lead">
            Questa prima demo immagina l app per la tua fidanzata: una cabina di
            regia familiare in cui vedere trend, check-in e 3 assistenti
            specializzati che aiutano a osservare, escalare e coordinare. Non
            sostituisce medici o emergenze.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#members">
              Apri i profili famiglia
            </a>
            <a className="button button-secondary" href="#assistants">
              Vedi i 3 assistenti
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Regola di prodotto</p>
          <h2>Se qualcosa diventa serio, il flusso si ferma e l aiuto umano viene prima.</h2>
          <p>
            L interfaccia mostra un percorso prudente: osservazione per i casi
            lievi, contatto con un professionista quando serve, messaggio urgente
            se compaiono red flag.
          </p>
          {urgentMember ? (
            <div className="escalation-banner">
              <span className="escalation-tag">Escalation attiva</span>
              <p>
                {urgentMember.name}: {urgentMember.summary}
              </p>
            </div>
          ) : null}
        </aside>
      </header>

      <section className="stat-grid" aria-label="Metriche chiave">
        <article className="stat-card">
          <span className="stat-value">{familyMembers.length}</span>
          <span className="stat-label">persone monitorate</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{attentionCount}</span>
          <span className="stat-label">situazioni da rivedere oggi</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{assistantCards.length}</span>
          <span className="stat-label">assistenti con handoff chiaro</span>
        </article>
      </section>

      <main className="dashboard">
        <section className="card roster-card" id="members">
          <div className="section-heading">
            <p className="section-kicker">Famiglia</p>
            <h2>Profili da seguire</h2>
          </div>
          <div className="member-list">
            {familyMembers.map((member) => (
              <button
                key={member.id}
                className={`member-card ${
                  member.id === activeMember.id ? 'is-active' : ''
                }`}
                type="button"
                onClick={() => setActiveMemberId(member.id)}
              >
                <span className={`status-dot tone-${member.statusTone}`} />
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.relationship}</p>
                </div>
                <div className="member-meta">
                  <span>{member.status}</span>
                  <small>Check-in {member.lastCheckIn}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="card spotlight-card">
          <div className="section-heading">
            <p className="section-kicker">Scheda di oggi</p>
            <h2>{activeMember.name}</h2>
          </div>
          <div className="spotlight-meta">
            <span className={`status-pill tone-${activeMember.statusTone}`}>
              {activeMember.status}
            </span>
            <span className="muted">Ultimo aggiornamento {activeMember.lastCheckIn}</span>
          </div>
          <p className="spotlight-summary">{activeMember.summary}</p>

          <div className="metric-grid">
            {activeMember.metrics.map((metric) => (
              <article key={metric.label} className={`metric-card tone-${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>

          <div className="note-block">
            <p className="note-label">Lettura prudente</p>
            <p>{activeMember.observation}</p>
          </div>

          <div className={`action-block tone-${activeMember.statusTone}`}>
            <p className="note-label">Prossimo passo suggerito</p>
            <p>{activeMember.nextStep}</p>
          </div>
        </section>

        <section className="card assistants-card" id="assistants">
          <div className="section-heading">
            <p className="section-kicker">Assistenti</p>
            <h2>I 3 agenti specializzati</h2>
          </div>
          <div className="assistant-grid">
            {assistantCards.map((assistant) => (
              <article key={assistant.name} className="assistant-card">
                <span className="assistant-eyebrow">{assistant.eyebrow}</span>
                <h3>{assistant.name}</h3>
                <p>{assistant.role}</p>
                <div className="assistant-output">
                  <span className="note-label">Su {activeMember.name}</span>
                  <p>{assistant.messages[activeMember.id]}</p>
                </div>
                <dl className="assistant-meta">
                  <div>
                    <dt>Chiede</dt>
                    <dd>{assistant.asks}</dd>
                  </div>
                  <div>
                    <dt>Limite</dt>
                    <dd>{assistant.limit}</dd>
                  </div>
                  <div>
                    <dt>Handoff</dt>
                    <dd>{assistant.handoff}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="card timeline-card">
          <div className="section-heading">
            <p className="section-kicker">Timeline</p>
            <h2>Ultimi eventi</h2>
          </div>
          <div className="timeline-list">
            {activeMember.timeline.map((item) => (
              <article
                key={`${activeMember.id}-${item.time}-${item.title}`}
                className="timeline-item"
              >
                <span className="timeline-time">{item.time}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card safety-card">
          <div className="section-heading">
            <p className="section-kicker">Sicurezza</p>
            <h2>Red flag che bloccano il tono leggero</h2>
          </div>
          <ul className="flag-list">
            {redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
          <p className="safety-copy">
            Se compare uno di questi segnali, l app deve interrompere consigli
            generici e invitare a cercare assistenza umana urgente o un
            professionista qualificato.
          </p>
        </section>

        <section className="card privacy-card">
          <div className="section-heading">
            <p className="section-kicker">Privacy</p>
            <h2>Tre pilastri prima della beta</h2>
          </div>
          <div className="pillar-list">
            {privacyPillars.map((pillar) => (
              <article key={pillar.title} className="pillar-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
