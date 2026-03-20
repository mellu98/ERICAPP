# Document Parser

## Obiettivo

Supportare upload di PDF, immagini di referti, visite ed esami del sangue con un parser multimodale capace di restituire JSON strutturato, auditabile e pronto per la UI famigliare.

## Scelta tecnica

- Modello predefinito: `gpt-5.4`
- API: `Responses API`
- Input supportati: PDF e immagini (`jpeg`, `jpg`, `png`, `webp`)
- Output: JSON Schema rigoroso validato server-side con Zod
- Stato richiesta: `store: false` per non rendere stateful la richiesta

## Perche questa strada

- Le docs OpenAI indicano che la `Responses API` e la via corrente per flussi multimodali con file e structured outputs.
- Le docs OpenAI mostrano che i file possono essere passati come `input_file` per PDF e `input_image` per immagini, anche tramite `file_id`.
- Le docs OpenAI mostrano che gli structured outputs nella `Responses API` passano da `text.format` con `json_schema` e `strict: true`.

## Pipeline

1. L utente carica un PDF o una immagine.
2. Il backend valida MIME type e dimensione.
3. Il file viene inviato alle Files API con `purpose: user_data`.
4. Il backend chiama `responses.create()` con:
   - prompt di estrazione non diagnostica
   - file come `input_file` o `input_image`
   - schema JSON rigido
   - `store: false`
5. Il JSON di risposta viene validato con Zod.
6. L app salva solo il risultato strutturato e i metadati di audit necessari.

## Guardrail fondamentali

- Il parser estrae, non diagnostica.
- Le sintesi devono restare descrittive.
- Tutti i documenti parsed hanno `requiresHumanReview: true`.
- I red flag vanno solo evidenziati come testo estratto dal documento.
- Nessun consiglio su farmaci, dosaggi o cambi terapeutici.

## Endpoint iniziale

- `POST /api/parse-medical-document`
- multipart form-data con un file e un eventuale campo `context`

## Prossimi passi consigliati

- cancellazione del file remoto dopo persistenza del risultato strutturato
- mascheramento dei dati identificativi non necessari
- storage cifrato lato app/backend
- parser specializzati per `lab_report` e `visit_note`
- review umana sempre obbligatoria prima di mostrare sintesi sensibili
