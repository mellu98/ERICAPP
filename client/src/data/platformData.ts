import type {
  PlatformSection,
  PlatformSummary,
  SpecialistAssistant,
} from '../types/platform'

export const platformSummary: PlatformSummary = {
  sectionCount: 4,
  alertCount: 2,
  parserStatus: 'Parser multimodale attivo',
  installStatus: 'PWA installabile',
}

export const sections: PlatformSection[] = [
  {
    id: 'erica',
    name: 'Erica',
    subtitle: 'Esami, documenti, chat privata e AI personale',
    status: 'Da seguire con calma',
    statusTone: 'amber',
    lastUpdate: '18 min fa',
    summary:
      'La sezione Erica raccoglie esami del sangue, visite, documenti caricati e una chat privata che resta separata dal resto della famiglia.',
    nextStep:
      'Caricare il prossimo PDF nella sezione Erica e far preparare una sintesi descrittiva prima della visita.',
    observation:
      'La struttura della piattaforma deve impedire che referti e conversazioni di Erica finiscano in uno spazio diverso.',
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
        note: 'Referti e allegati tenuti solo nella sezione Erica.',
        tone: 'teal',
      },
      {
        label: 'Chat',
        value: '1 thread attivo',
        note: 'Il thread non si mescola con quello di Lina, Antonio o Keyssy.',
        tone: 'amber',
      },
      {
        label: 'AI personale',
        value: 'Assistente Erica',
        note: 'Copilot dedicato al suo storico, non medico reale.',
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
        'Ho riordinato gli ultimi esami di Erica per data e posso mostrare i valori esplicitamente fuori range senza fare diagnosi.',
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
    subtitle: 'Referti, storico e follow-up dedicati',
    status: 'Stabile ma da osservare',
    statusTone: 'teal',
    lastUpdate: '52 min fa',
    summary:
      'Lina ha una sua area con storico separato, referti ordinati e una chat AI dedicata solo ai suoi documenti e ai suoi follow-up.',
    nextStep:
      'Usare il parser per trasformare i referti lunghi in JSON e mantenere i confronti cronologici solo dentro la sezione Lina.',
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
        note: 'Raccolta dedicata a referti e immagini della sezione Lina.',
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
    subtitle: 'Controllo quotidiano, documenti e allerta prudente',
    status: 'Escalation prudente',
    statusTone: 'rose',
    lastUpdate: '9 min fa',
    summary:
      'Antonio ha una sezione con monitoraggio, documenti e chat dedicata. Se compaiono segnali importanti, la sua conversazione deve fermarsi e alzare l escalation.',
    nextStep:
      'Usare il parser per estrarre i dati utili dal prossimo report e tenere il thread AI prudente, senza conclusioni cliniche.',
    observation:
      'Questa e la sezione che mostra meglio il confine del prodotto: dati separati, chat separata e handoff immediato quando qualcosa sembra serio.',
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
    subtitle: 'Upload immagini, documenti e thread dedicato',
    status: 'Pronta per nuovi upload',
    statusTone: 'teal',
    lastUpdate: '1 h fa',
    summary:
      'Keyssy ha una sezione dedicata a immagini di referti, PDF, chat privata e cronologia ordinata per non confondere nulla con gli altri.',
    nextStep:
      'Usare la sua chat per trasformare immagini di esami in note leggibili e confronti con i documenti gia caricati.',
    observation:
      'Questa e la sezione ideale per testare l upload di immagini e la trasformazione in JSON strutturato prima di salvarle nello storico.',
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
        note: 'Ogni upload viene spiegato nella sua conversazione personale.',
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

export const specialists: SpecialistAssistant[] = [
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
