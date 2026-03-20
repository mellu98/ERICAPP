# Safety, Privacy & Medical Guardrails

Questo documento definisce i limiti di prodotto per una app familiare di monitoraggio salute/benessere. L'obiettivo e supportare il benessere e la comunicazione tra familiari, non fare diagnosi, prescrizioni o triage medico automatico.

## Confini del prodotto

- La app puo raccogliere e mostrare informazioni di benessere: sintomi dichiarati dall'utente, parametri inseriti manualmente, promemoria, routine, note, contatti di emergenza, stato generale e trend nel tempo.
- La app puo aiutare a ricordare azioni utili: bere acqua, riposo, assunzione di farmaci gia prescritti, controlli programmati, contatto con un familiare o con un professionista sanitario.
- La app puo generare riepiloghi descrittivi, non clinici, basati solo sui dati inseriti dall'utente.
- La app non deve mai dichiarare di sostituire un medico, un infermiere o un pronto soccorso.
- La app non deve diagnosticare malattie, interpretare esami, confermare cause di sintomi, suggerire terapie personalizzate o modificare dosi di farmaci.
- La app non deve vendere i 3 agenti come "medici". Devono essere presentati come assistenti di benessere, monitoraggio e orientamento.
- La app non deve automatizzare decisioni critiche senza intervento umano, specialmente quando sono presenti minori, anziani fragili o persone con patologie note.

## Red Flags

Se un utente segnala uno di questi segnali, la app deve interrompere qualsiasi tono leggero o generico e mostrare un percorso di escalation immediato:

- Dolore al petto, difficolta respiratoria, labbra blu, svenimento, convulsioni.
- Segni compatibili con ictus: viso asimmetrico, braccio debole, linguaggio alterato, confusione improvvisa.
- Reazione allergica grave: gonfiore di viso/gola, respiro sibilante, peggioramento rapido.
- Sanguinamento importante, trauma serio, perdita di coscienza, vomito persistente con disidratazione.
- Febbre alta in neonati o lattanti, rigidita del collo, sonnolenza marcata, disidratazione severa.
- Idea di farsi del male, violenza, abuso, trascuratezza o rischio immediato per una persona vulnerabile.
- Peggioramento rapido o sintomi nuovi e preoccupanti dopo un intervento, una caduta o l'assunzione di un farmaco.

## Regole Di Escalation

La logica di escalation deve essere semplice, esplicita e conservativa.

1. Emergenza immediata: mostrare un messaggio chiaro che invita a chiamare i servizi di emergenza locali o a recarsi al pronto soccorso, senza dare consigli diagnostici.
2. Valutazione medica in giornata: se i sintomi sono preoccupanti ma non chiaramente emergenziali, suggerire il contatto con il medico curante, guardia medica o telemedicina qualificata.
3. Monitoraggio caregiver: per segnali lievi o dubbi non urgenti, proporre osservazione, registrazione dei sintomi, idratazione, riposo e follow-up nel tempo.
4. Raccogliere segnali mancanti: se manca contesto, chiedere solo domande minime e non invasive per capire la gravita del quadro, senza fare diagnosi.
5. Stop alla conversazione se compare rischio grave: sospendere riepiloghi o suggerimenti non essenziali e spostare l'utente su un flusso di sicurezza.

Regole pratiche:

- Mai rassicurare in modo eccessivo quando esiste un possibile red flag.
- Mai dare istruzioni che possano ritardare l'assistenza urgente.
- Mai chiedere all'utente di confermare una diagnosi che la app non puo fare.
- Mai usare probabilita cliniche o linguaggio da triage professionale se non verificato da personale abilitato.

## Disclaimer UX

I disclaimer devono essere visibili, brevi e ripetuti nei punti giusti, non nascosti nei termini legali.

- Onboarding: "Questa app aiuta la famiglia a monitorare il benessere, non sostituisce un professionista sanitario."
- Schermata di inserimento sintomi: "Se il problema e grave o rapido, contatta subito un medico o i servizi di emergenza."
- Output degli assistenti: etichetta sempre le risposte come "supporto informativo" o "orientamento", mai come consiglio medico.
- Prima di salvare dati sensibili: spiegare chi potra vederli e con quale consenso.
- In presenza di contenuti generati dall'AI: mostrare che il risultato deriva dai dati inseriti e puo essere incompleto o errato.

Il tono UX deve essere calmo e pratico. Non deve creare panico, ma nemmeno minimizzare.

## Dati Sensibili E Consenso

I dati di salute sono dati particolari e richiedono una protezione forte.

- Trattare come dati sensibili: sintomi, diagnosi dichiarate, farmaci, allergie, valori vitali, referti, note mediche, cronologia di ricoveri, gravidanza, salute mentale, disabilita, dati di minori, posizione se usata per motivi sanitari.
- Richiedere consenso esplicito e separato per ogni persona monitorata.
- Chiarire chi e il titolare del profilo, chi puo accedervi e chi puo modificare i dati.
- Consentire revoca del consenso e rimozione del profilo con effetti chiari su condivisione, backup e cronologia.
- Se un caregiver inserisce dati su un'altra persona, verificare che abbia autorita o delega appropriata secondo il contesto locale e familiare.
- Per i minori, prevedere un flusso dedicato con controllo genitoriale o tutorio dove richiesto.
- Se vengono condivise note tra familiari, separare chiaramente dati personali, dati condivisi e dati privati.

## Logging Minimo

Il logging deve essere utile per debug e sicurezza, ma mai invasivo.

- Loggare eventi tecnici: accesso, salvataggio, errore, timeout, cambio consenso, esportazione, cancellazione.
- Evitare il logging di testo libero contenente sintomi, referti, farmaci o note personali, salvo casi strettamente necessari e con masking.
- Mascherare identificativi diretti e usare ID pseudonimi quando possibile.
- Separare log applicativi da dati clinici o di benessere.
- Impostare retention breve per log operativi e distinguere i log di sicurezza da quelli di prodotto.
- Non usare contenuti sanitari per training, analytics o marketing senza base giuridica e consenso adeguati.

## Rischi Legali E Di Prodotto

- Rischio di sconfinare nel territorio del dispositivo medico se la app suggerisce diagnosi, priorita cliniche o terapie.
- Rischio privacy elevato per via del trattamento di dati sanitari, che richiede controllo degli accessi, minimizzazione e basi giuridiche solide.
- Rischio reputazionale se la app sembra rassicurare troppo o ignora sintomi seri.
- Rischio di danno reale se il sistema ritarda la richiesta di assistenza urgente.
- Rischio di accesso improprio da parte di familiari, ex partner o altri utenti non autorizzati.
- Rischio di ambiguita su chi sia l'utilizzatore finale: caregiver, familiare assistito o entrambi.
- Rischio di dipendenza eccessiva dall'AI se i 3 agenti appaiono piu autorevoli di quanto siano.

## Must-Have Prima Della Beta

- Flusso di consenso per ogni persona monitorata.
- Access control chiaro tra profili familiari, caregiver e persone assistite.
- Disclaimer visibili in onboarding, inserimento dati e output degli assistenti.
- Flusso di emergenza con messaggi bloccanti per red flag.
- Flusso di valutazione non urgente con suggerimento a professionisti qualificati.
- Possibilita di cancellazione, export e revoca del consenso.
- Logging minimale verificato e privo di dati sanitari in chiaro.
- Test di abuso per contenuti sensibili, minori, autolesionismo e sintomi critici.
- Review legale/privacy prima di beta pubblica.
- Messaggi e UI coerenti con un prodotto wellness, non medico.

## Criteri Di Blocco

Bloccare la beta se almeno uno dei seguenti punti non e soddisfatto:

- La app puo essere percepita ragionevolmente come un sostituto del medico.
- Il flusso di emergenza non e immediato o e confuso.
- I dati sanitari non sono protetti con consenso e accesso appropriati.
- L'utente non puo capire chi vede cosa.
- I log espongono dati sensibili.
- Gli assistenti generano diagnosi, terapie o rassicurazioni ingiustificate.

