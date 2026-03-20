# ERICAPP

Prototipo di una family wellness app pensata per aiutare un caregiver a monitorare il benessere delle persone care con check-in, trend e coordinamento familiare.

## Cosa c'e dentro

- `client/`: prototipo frontend in React + Vite.
- `server/`: backend TypeScript per parsing di PDF e immagini con OpenAI.
- `docs/architecture.md`: direzione tecnica, MVP e roadmap.
- `docs/safety.md`: guardrail di safety, privacy ed escalation.
- `docs/agents.md`: definizione dei 3 assistenti virtuali.
- `docs/document-parser.md`: pipeline del parser multimodale.

## I 3 assistenti

- `Care Compass`: osserva routine, energia, sonno e trend quotidiani.
- `Signal Triage`: riconosce segnali da non ignorare e alza l escalation.
- `Family Care Planner`: trasforma tutto in promemoria, riepiloghi e handoff pratici.

## Principio non negoziabile

L app non e un medico, non fa diagnosi e non sostituisce professionisti sanitari o servizi di emergenza.

## Avvio locale

```bash
cd client
npm install
npm run dev
```

Backend parser:

```bash
cd server
npm install
npm run dev
```

Per build di produzione:

```bash
cd client
npm run build
```
