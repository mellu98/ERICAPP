import { useState } from 'react'
import './App.css'

type Tone = 'teal' | 'amber' | 'rose'

type Metric = {
  label: string
  value: string
  tone: Tone
}

type WorkspaceCard = {
  label: string
  value: string
  note: string
  tone: Tone
}

type DocumentItem = {
  title: string
  kind: string
  date: string
}

type ChatSnapshot = {
  assistantName: string
  status: string
  latestMessage: string
  nextAction: string
}

type TimelineEntry = {
  time: string
  title: string
  note: string
}

type PersonSection = {
  id: string
  name: string
  subtitle: string
  status: string
  statusTone: Tone
  lastUpdate: string
  summary: string
  nextStep: string
  observation: string
  metrics: Metric[]
  workspaces: WorkspaceCard[]
  documents: DocumentItem[]
  chat: ChatSnapshot
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

const sections: PersonSection[] = [
  {
    id: 'erica',
    name: 'Erica',
    subtitle: 'Sezione personale · esami, chat, documenti, AI',
    status: 'Da seguire con calma',
    statusTone: 'amber',
    lastUpdate: '18 min fa',
    summary:
      'La sezione di Erica tiene insieme esami del sangue, note della visita e una chat privata con il suo assistente AI personale.',
    nextStep:
      'Caricare il prossimo referto nella sua area, lasciare il contesto e far preparare un riepilogo leggibile prima della visita.',
    observation:
      'Qui il valore e avere tutto nello stesso posto, ma separato dalle altre persone: niente documenti misti e niente chat condivise per errore.',
    metrics: [
      { label: 'Ultimo check-in', value: 'Oggi', tone: 'amber' },
      { label: 'Esami recenti', value: '6', tone: 'teal' },
      { label: 'Documenti', value: '12', tone: 'teal' },
      { label: 'Chat privata', value: 'Attiva', tone: 'teal' },
    ],
    workspaces: [
      {
        label: 'Esami',
        value: '6 archiviati',
        note: 'Emocromo, ferritina, vitamina D e controlli correlati.',
        tone: 'teal',
      },
      {
        label: 'Documenti',
        value: '12 file',
        note: 'Visite, referti e allegati tenuti solo nella sezione Erica.',
        tone: 'teal',
      },
      {
        label: 'Chat',
        value: '1 thread attivo',
        note: 'La conversazione non si mescola con Lina, Antonio o Keyssy.',
        tone: 'amber',
      },
      {
        label: 'AI personale',
        value: 'Assistente Erica',
        note: 'Copilot dedicato alla sua cronologia, non medico reale.',
        tone: 'teal',
      },
    ],
    documents: [
      { title: 'Emocromo completo', kind: 'Esame del sangue', date: '18 mar 2026' },
      { title: 'Visita di controllo', kind: 'Referto PDF', date: '11 mar 2026' },
      { title: 'Vitamina D', kind: 'Immagine report', date: '03 mar 2026' },
    ],
    chat: {
      assistantName: 'Assistente Erica',
      status: 'Thread personale attivo',
      latestMessage:
        'Ho ordinato gli ultimi esami di Erica per data e posso evidenziare i valori esplicitamente fuori range senza fare diagnosi.',
      nextAction: 'Carica il prossimo PDF e aggiungi un contesto breve prima di inviarlo al parser.',
    },
    timeline: [
      {
        time: '20:40',
        title: 'Chat aggiornata',
        note: 'Preparato un riassunto semplice degli ultimi esami di Erica.',
      },
      {
        time: '18:10',
        title: 'Documento caricato',
        note: 'Nuovo referto PDF archiviato nella sezione Erica.',
      },
      {
        time: '09:20',
        title: 'Check-in registrato',
        note: 'Annotato livello di energia e nota breve sul sonno.',
      },
    ],
  },
  {
    id: 'lina',
    name: 'Lina',
    subtitle: 'Sezione personale · referti, storico e follow-up',
    status: 'Stabile ma da osservare',
    statusTone: 'teal',
    lastUpdate: '52 min fa',
    summary:
      'Lina ha il suo storico separato con documenti clinici, follow-up della visita e una chat AI dedicata solo a lei.',
    nextStep:
      'Mantenere la cronologia ordinata e usare il parser per trasformare i referti lunghi in JSON e riepilogo descrittivo.',
    observation:
      'La separazione per persona abbassa moltissimo il rischio di leggere o riassumere il documento sbagliato.',
    metrics: [
      { label: 'Ultimo check-in', value: 'Ieri', tone: 'teal' },
      { label: 'Esami recenti', value: '3', tone: 'teal' },
      { label: 'Documenti', value: '8', tone: 'teal' },
      { label: 'Chat privata', value: 'Attiva', tone: 'teal' },
    ],
    workspaces: [
      {
        label: 'Esami',
        value: '3 archiviati',
        note: 'Controlli recenti gia separati per data e tipo.',
        tone: 'teal',
      },
      {
        label: 'Documenti',
        value: '8 file',
        note: 'Raccolta dedicata a referti e immagini della sua sezione.',
        tone: 'teal',
      },
      {
        label: 'Chat',
        value: '2 thread chiusi',
        note: 'Storico consultabile senza toccare le altre persone.',
        tone: 'teal',
      },
      {
        label: 'AI personale',
        value: 'Assistente Lina',
        note: 'Risponde solo sulla base del suo archivio e dei suoi upload.',
        tone: 'teal',
      },
    ],
    documents: [
      { title: 'Referto visita annuale', kind: 'PDF', date: '16 mar 2026' },
      { title: 'Esame strumentale', kind: 'Immagine report', date: '10 mar 2026' },
      { title: 'Esami chimica clinica', kind: 'PDF', date: '28 feb 2026' },
    ],
    chat: {
      assistantName: 'Assistente Lina',
      status: 'Thread ordinato',
      latestMessage:
        'Ho separato i documenti di Lina in ordine cronologico e posso preparare una sintesi pronta per la prossima visita.',
      nextAction: 'Carica la nuova visita e chiedi un confronto con il referto precedente.',
    },
    timeline: [
      {
        time: '19:25',
        title: 'Referto ordinato',
        note: 'L assistente AI ha riassunto i punti chiave del PDF di Lina.',
      },
      {
        time: '14:05',
        title: 'Promemoria follow-up',
        note: 'Preparata una nota con le domande da portare alla visita.',
      },
      {
        time: '08:55',
        title: 'Documento taggato',
        note: 'Nuovo file associato correttamente alla sezione Lina.',
      },
    ],
  },
  {
    id: 'antonio',
    name: 'Antonio',
    subtitle: 'Sezione personale · controllo quotidiano e trend',
    status: 'Escalation prudente',
    statusTone: 'rose',
    lastUpdate: '9 min fa',
    summary:
      'Antonio ha una sezione con monitoraggio, documenti e chat dedicata. Se compaiono segnali importanti, la sua chat deve fermarsi e alzare l escalation.',
    nextStep:
      'Usare il parser per estrarre i dati utili dal prossimo report e mantenere il thread AI prudente, senza conclusioni cliniche.',
    observation:
      'Questa sezione e quella che mostra meglio il confine del prodotto: dati separati, chat separata e handoff immediato quando qualcosa sembra serio.',
    metrics: [
      { label: 'Ultimo check-in', value: 'Ora', tone: 'rose' },
      { label: 'Esami recenti', value: '4', tone: 'amber' },
      { label: 'Documenti', value: '9', tone: 'teal' },
      { label: 'Chat privata', value: 'In allerta', tone: 'rose' },
    ],
    workspaces: [
      {
        label: 'Esami',
        value: '4 archiviati',
        note: 'Controlli recenti pronti da confrontare nel tempo.',
        tone: 'amber',
      },
      {
        label: 'Documenti',
        value: '9 file',
        note: 'Visite e referti restano solo nella sezione Antonio.',
        tone: 'teal',
      },
      {
        label: 'Chat',
        value: 'Allerta attiva',
        note: 'Il thread AI blocca il tono leggero se emergono red flag.',
        tone: 'rose',
      },
      {
        label: 'AI personale',
        value: 'Assistente Antonio',
        note: 'Storia separata, contesto separato, risposta prudente.',
        tone: 'rose',
      },
    ],
    documents: [
      { title: 'Controllo pressione', kind: 'PDF', date: '20 mar 2026' },
      { title: 'Esami sangue routine', kind: 'PDF', date: '14 mar 2026' },
      { title: 'Nota follow-up', kind: 'Documento', date: '07 mar 2026' },
    ],
    chat: {
      assistantName: 'Assistente Antonio',
      status: 'Thread in modalita prudente',
      latestMessage:
        'Ho visto un cambiamento che richiede attenzione. Posso solo riordinare i dati e preparare un messaggio chiaro per un professionista.',
      nextAction: 'Se carichi un nuovo referto, verra salvato solo nella sezione Antonio e confrontato con i precedenti.',
    },
    timeline: [
      {
        time: '20:47',
        title: 'Escalation di sezione',
        note: 'La chat di Antonio ha bloccato il flusso generico e tenuto solo il riepilogo utile.',
      },
      {
        time: '17:30',
        title: 'Nuovo PDF archiviato',
        note: 'Documento assegnato correttamente alla sezione Antonio.',
      },
      {
        time: '10:15',
        title: 'Trend aggiornato',
        note: 'Riordinati i controlli recenti senza fare interpretazioni cliniche.',
      },
    ],
  },
  {
    id: 'keyssy',
    name: 'Keyssy',
    subtitle: 'Sezione personale · upload immagini e documenti',
    status: 'Pronta per nuovi upload',
    statusTone: 'teal',
    lastUpdate: '1 h fa',
    summary:
      'Keyssy ha una sezione dedicata a immagini di referti, PDF, chat privata e cronologia ordinata per non confondere nulla con gli altri.',
    nextStep:
      'Usare la sua chat per trasformare immagini di esami in note leggibili e confronti con i documenti gia caricati.',
    observation:
      'Questa sezione e perfetta per testare l upload di immagini e la trasformazione in JSON strutturato prima di salvarle nello storico.',
    metrics: [
      { label: 'Ultimo check-in', value: '2 giorni fa', tone: 'teal' },
      { label: 'Esami recenti', value: '5', tone: 'teal' },
      { label: 'Documenti', value: '11', tone: 'teal' },
      { label: 'Chat privata', value: 'Pronta', tone: 'teal' },
    ],
    workspaces: [
      {
        label: 'Esami',
        value: '5 archiviati',
        note: 'Storico pulito per confronti futuri.',
        tone: 'teal',
      },
      {
        label: 'Documenti',
        value: '11 file',
        note: 'Upload immagini e PDF tenuti solo nella sua area.',
        tone: 'teal',
      },
      {
        label: 'Chat',
        value: 'Pronta ai nuovi file',
        note: 'Ogni nuovo upload viene spiegato nella sua conversazione personale.',
        tone: 'teal',
      },
      {
        label: 'AI personale',
        value: 'Assistente Keyssy',
        note: 'Thread dedicato a documenti e follow-up di Keyssy.',
        tone: 'teal',
      },
    ],
    documents: [
      { title: 'Referto immagine', kind: 'JPEG', date: '19 mar 2026' },
      { title: 'Esami sangue sportivi', kind: 'PDF', date: '12 mar 2026' },
      { title: 'Check nutrizionale', kind: 'Documento', date: '01 mar 2026' },
    ],
    chat: {
      assistantName: 'Assistente Keyssy',
      status: 'Thread pronto',
      latestMessage:
        'Appena carichi un immagine di referto, posso estrarre i campi utili e salvarli solo nello storico di Keyssy.',
      nextAction: 'Prova un upload immagine dalla PWA e verifica che finisca nella sezione giusta.',
    },
    timeline: [
      {
        time: '18:20',
        title: 'Immagine classificata',
        note: 'Nuovo report immagine associato alla sezione Keyssy.',
      },
      {
        time: '13:40',
        title: 'Chat pronta al confronto',
        note: 'Il thread AI ha preparato il confronto con i documenti precedenti.',
      },
      {
        time: '09:35',
        title: 'Sezione aggiornata',
        note: 'Contatori di esami, documenti e chat sincronizzati.',
      },
    ],
  },
]

const assistantCards: AssistantCard[] = [
  {
    name: 'Care Compass',
    eyebrow: 'Monitoraggio quotidiano',
    role:
      'Raccoglie trend leggeri e mette ordine nello storico personale di ciascuna sezione.',
    asks:
      'Check-in, energia, sonno, note e contesto minimo del documento appena caricato.',
    limit:
      'Non fa diagnosi e non mescola mai i dati tra sezioni diverse.',
    handoff:
      'Se serve piu prudenza, passa solo il contesto essenziale a Signal Triage.',
    messages: {
      erica:
        'Ho ordinato esami e documenti di Erica per data e posso mostrare i trend utili senza uscire dal suo perimetro.',
      lina:
        'La cronologia di Lina e pulita: posso confrontare il nuovo PDF con il referto precedente e lasciare un riassunto leggibile.',
      antonio:
        'Per Antonio tengo il diario aggiornato, ma quando i segnali diventano seri mi fermo e passo la mano al triage prudente.',
      keyssy:
        'Per Keyssy posso trasformare immagini e PDF in una vista ordinata con storico e note semplici.',
    },
  },
  {
    name: 'Signal Triage',
    eyebrow: 'Segnali da non ignorare',
    role:
      'Tiene una linea prudente per ogni persona, soprattutto quando in chat o nei documenti compaiono elementi da non minimizzare.',
    asks:
      'Sintomo principale, andamento, urgenza percepita e parti del referto da osservare con attenzione.',
    limit:
      'Non interpreta diagnosi, non cambia terapie e non usa il tono leggero in presenza di red flag.',
    handoff:
      'Quando serve, consegna solo urgenza, contesto e prossima azione al planner familiare.',
    messages: {
      erica:
        'Nella sezione Erica posso evidenziare solo cio che il documento mostra chiaramente e segnalare quando e meglio chiedere un parere umano.',
      lina:
        'Su Lina mantengo il parsing prudente: se un nuovo referto contiene indicazioni importanti, le isolo senza interpretarle.',
      antonio:
        'Per Antonio il thread resta in modalita prudente: se compare un red flag, niente rassicurazioni, solo handoff e messaggio chiaro.',
      keyssy:
        'Su Keyssy posso classificare il livello di attenzione del contenuto caricato, ma senza trasformarmi in un medico reale.',
    },
  },
  {
    name: 'Family Care Planner',
    eyebrow: 'Coordinamento familiare',
    role:
      'Prende i dati della singola sezione persona e li converte in promemoria, riepiloghi e continuita pratica.',
    asks:
      'Chi e la persona, quali documenti sono stati caricati, che follow-up serve e per quando.',
    limit:
      'Non prende decisioni cliniche e non sposta dati tra una persona e l altra.',
    handoff:
      'Chiude il cerchio con memoria condivisibile ma sempre filtrata per la sezione giusta.',
    messages: {
      erica:
        'Posso preparare per Erica una mini scheda con esami, documenti e domande da tenere pronte per la visita.',
      lina:
        'Per Lina organizzo referti, riassunto e prossimi passi senza mischiarli con il resto della famiglia.',
      antonio:
        'Per Antonio preparo un riepilogo rapido e prudente da condividere con chi deve intervenire.',
      keyssy:
        'Per Keyssy trasformo immagini e PDF in uno storico ordinato con promemoria e confronto dei caricamenti.',
    },
  },
]

const redFlags = [
  'difficolta respiratoria o peggioramento rapido',
  'dolore forte improvviso o perdita di coscienza',
  'confusione marcata, sanguinamento importante o trauma serio',
  'referti che riportano indicazioni urgenti da non minimizzare',
  'rischio immediato per una persona fragile o vulnerabile',
]

const privacyPillars = [
  {
    title: 'Una sezione per persona',
    copy:
      'Erica, Lina, Antonio e Keyssy hanno aree separate: documenti, chat e parser non devono mai incrociarsi.',
  },
  {
    title: 'Contesto minimo e consenso',
    copy:
      'Ogni upload deve entrare nella sezione giusta con il minimo contesto necessario e con regole chiare di accesso.',
  },
  {
    title: 'Audit e revoca',
    copy:
      'Serve sapere chi ha caricato un referto, chi l ha letto e come revocare accesso o condivisione per ogni persona.',
  },
]

function App() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id)

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0]

  const alertCount = sections.filter(
    (section) => section.statusTone !== 'teal',
  ).length

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ERICAPP PWA</p>
          <h1>Quattro sezioni persona, una sola cabina di regia familiare.</h1>
          <p className="lead">
            L app si sviluppa in 4 aree dedicate: <strong>Erica</strong>,{' '}
            <strong>Lina</strong>, <strong>Antonio</strong> e{' '}
            <strong>Keyssy</strong>. Ognuno ha i propri esami, la propria chat,
            i propri documenti e il proprio assistente AI personale, sempre
            separati dagli altri.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#sections">
              Apri le sezioni
            </a>
            <a className="button button-secondary" href="#records">
              Vedi documenti e chat
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Struttura PWA</p>
          <h2>Ogni persona ha il suo spazio isolato: upload, storico, chat e AI.</h2>
          <p>
            La PWA non e piu una dashboard generica: e un contenitore a sezioni
            personali, pensato per tenere separati i dati e facilitare upload,
            parsing e riepiloghi per ciascun membro della famiglia.
          </p>
        </aside>
      </header>

      <section className="stat-grid" aria-label="Metriche chiave">
        <article className="stat-card">
          <span className="stat-value">{sections.length}</span>
          <span className="stat-label">sezioni persona attive</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{alertCount}</span>
          <span className="stat-label">sezioni da rivedere oggi</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">PWA</span>
          <span className="stat-label">installabile su telefono e desktop</span>
        </article>
      </section>

      <main className="dashboard">
        <section className="card roster-card" id="sections">
          <div className="section-heading">
            <p className="section-kicker">Sezioni</p>
            <h2>Erica, Lina, Antonio, Keyssy</h2>
          </div>
          <div className="member-list">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`member-card ${
                  section.id === activeSection.id ? 'is-active' : ''
                }`}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
              >
                <span className={`status-dot tone-${section.statusTone}`} />
                <div>
                  <strong>{section.name}</strong>
                  <p>{section.subtitle}</p>
                </div>
                <div className="member-meta">
                  <span>{section.status}</span>
                  <small>Aggiornata {section.lastUpdate}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="card spotlight-card">
          <div className="section-heading">
            <p className="section-kicker">Sezione attiva</p>
            <h2>{activeSection.name}</h2>
          </div>
          <div className="spotlight-meta">
            <span className={`status-pill tone-${activeSection.statusTone}`}>
              {activeSection.status}
            </span>
            <span className="muted">Ultimo aggiornamento {activeSection.lastUpdate}</span>
          </div>

          <p className="spotlight-summary">{activeSection.summary}</p>

          <div className="metric-grid">
            {activeSection.metrics.map((metric) => (
              <article key={metric.label} className={`metric-card tone-${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>

          <div className="workspace-grid">
            {activeSection.workspaces.map((workspace) => (
              <article
                key={workspace.label}
                className={`workspace-card tone-${workspace.tone}`}
              >
                <span>{workspace.label}</span>
                <strong>{workspace.value}</strong>
                <p>{workspace.note}</p>
              </article>
            ))}
          </div>

          <div className="note-block">
            <p className="note-label">Lettura di prodotto</p>
            <p>{activeSection.observation}</p>
          </div>

          <div className={`action-block tone-${activeSection.statusTone}`}>
            <p className="note-label">Prossimo passo</p>
            <p>{activeSection.nextStep}</p>
          </div>
        </section>

        <section className="card records-card" id="records">
          <div className="section-heading">
            <p className="section-kicker">Area personale</p>
            <h2>Documenti e chat di {activeSection.name}</h2>
          </div>

          <div className="records-grid">
            <article className="records-panel">
              <h3>Documenti della sezione</h3>
              <div className="document-list">
                {activeSection.documents.map((document) => (
                  <div key={`${document.title}-${document.date}`} className="document-item">
                    <strong>{document.title}</strong>
                    <p>{document.kind}</p>
                    <span>{document.date}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="records-panel">
              <h3>Chat privata e AI personale</h3>
              <div className="chat-panel">
                <span className="chat-tag">{activeSection.chat.assistantName}</span>
                <p className="chat-status">{activeSection.chat.status}</p>
                <p>{activeSection.chat.latestMessage}</p>
                <div className="chat-next">
                  <p className="note-label">Prossima azione</p>
                  <p>{activeSection.chat.nextAction}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="card assistants-card" id="assistants">
          <div className="section-heading">
            <p className="section-kicker">Assistenti</p>
            <h2>I 3 specialisti dietro ogni medico AI personale</h2>
          </div>
          <div className="assistant-grid">
            {assistantCards.map((assistant) => (
              <article key={assistant.name} className="assistant-card">
                <span className="assistant-eyebrow">{assistant.eyebrow}</span>
                <h3>{assistant.name}</h3>
                <p>{assistant.role}</p>
                <div className="assistant-output">
                  <span className="note-label">Su {activeSection.name}</span>
                  <p>{assistant.messages[activeSection.id]}</p>
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
            <p className="section-kicker">Storico sezione</p>
            <h2>Ultimi eventi di {activeSection.name}</h2>
          </div>
          <div className="timeline-list">
            {activeSection.timeline.map((item) => (
              <article
                key={`${activeSection.id}-${item.time}-${item.title}`}
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
            <h2>La separazione per persona non cambia i guardrail</h2>
          </div>
          <ul className="flag-list">
            {redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
          <p className="safety-copy">
            Ogni sezione ha il suo assistente AI personale, ma nessuno di questi
            assistenti e un medico reale. Se compare un red flag, il flusso va
            fermato e si passa a supporto umano.
          </p>
        </section>

        <section className="card privacy-card">
          <div className="section-heading">
            <p className="section-kicker">Privacy</p>
            <h2>Regole chiave per le 4 sezioni persona</h2>
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
