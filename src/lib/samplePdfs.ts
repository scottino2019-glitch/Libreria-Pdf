import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface SamplePdfResult {
  id: string;
  filename: string;
  title: string;
  size: number;
  addedAt: string;
  url: string; // Data URL
  isSample: boolean;
}

export async function generateSamplePdfsClient(): Promise<SamplePdfResult[]> {
  const results: SamplePdfResult[] = [];

  try {
    // 1. Guida alla Lettura Digitale
    const doc1 = await PDFDocument.create();
    const fontHelvetica = await doc1.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc1.embedFont(StandardFonts.HelveticaBold);

    // Page 1
    let page1 = doc1.addPage([595.28, 841.89]); // A4
    page1.drawText('Guida alla Lettura e Gestione PDF', {
      x: 50,
      y: 780,
      size: 22,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
    });
    page1.drawText('Benvenuto nella tua Libreria PDF Personale!', {
      x: 50,
      y: 745,
      size: 14,
      font: fontHelvetica,
      color: rgb(0.3, 0.3, 0.3),
    });

    const bodyText1 = [
      'Questa applicazione ti permette di raccogliere, organizzare e leggere i tuoi',
      'documenti PDF direttamente nel tuo browser, senza bisogno di alcun server!',
      '',
      'Caratteristiche Principali:',
      '• Temi di Lettura: Scegli tra Chiaro, Sepia, Scuro, Notte e Verde per ridurre l\'affaticamento visivo.',
      '• Segnalibri Personalizzati: Salva le tue pagine preferite con annotazioni riservate.',
      '• Grandezza Testo e Zoom: Regola la scala di lettura per una visualizzazione ideale.',
      '• Modalita Mobile: Interfaccia con scaffale in legno e controlli touch per smartphone e tablet.',
      '• Salvataggio 100% Client-Side: I tuoi file rimangono memorizzati nel tuo browser (IndexedDB).',
      '',
      'Passa alla pagina successiva per scoprire le scorciatoie di lettura...'
    ];

    let yPos1 = 700;
    for (const line of bodyText1) {
      if (line.startsWith('•')) {
        page1.drawText(line, { x: 60, y: yPos1, size: 12, font: fontHelvetica, color: rgb(0.15, 0.15, 0.15) });
      } else if (line.endsWith(':')) {
        page1.drawText(line, { x: 50, y: yPos1, size: 13, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      } else {
        page1.drawText(line, { x: 50, y: yPos1, size: 12, font: fontHelvetica, color: rgb(0.2, 0.2, 0.2) });
      }
      yPos1 -= 22;
    }
    page1.drawText('Pagina 1 di 2', { x: 260, y: 30, size: 10, font: fontHelvetica, color: rgb(0.5, 0.5, 0.5) });

    // Page 2
    let page2 = doc1.addPage([595.28, 841.89]);
    page2.drawText('Come Usare i Segnalibri e i Temi', {
      x: 50,
      y: 780,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.6),
    });

    const bodyText2 = [
      '1. Segnalibri:',
      'Mentre leggi un documento, tocca l\'icona del segnalibro nella barra in alto.',
      'Puoi inserire un titolo o una nota per ricordare perche hai salvato quella pagina.',
      '',
      '2. Modalita Notte e Sepia:',
      'In ambienti bui, attiva il tema Notte o Scuro per invertire i colori e proteggere la vista.',
      'Il tema Sepia dona un sapore classico di libro stampato su carta calda.',
      '',
      '3. Inserimento nuovi PDF:',
      'Trascina o seleziona un file .pdf dalla schermata Libreria per aggiungerlo subito',
      'alla tua raccolta personale.',
      '',
      'Buona lettura!'
    ];

    let yPos2 = 730;
    for (const line of bodyText2) {
      if (/^\d\./.test(line)) {
        page2.drawText(line, { x: 50, y: yPos2, size: 13, font: fontBold, color: rgb(0.1, 0.3, 0.5) });
      } else {
        page2.drawText(line, { x: 60, y: yPos2, size: 12, font: fontHelvetica, color: rgb(0.2, 0.2, 0.2) });
      }
      yPos2 -= 22;
    }
    page2.drawText('Pagina 2 di 2', { x: 260, y: 30, size: 10, font: fontHelvetica, color: rgb(0.5, 0.5, 0.5) });

    const dataUrl1 = await doc1.saveAsBase64({ dataUri: true });
    results.push({
      id: 'Guida_alla_Lettura_Digitale.pdf',
      filename: 'Guida_alla_Lettura_Digitale.pdf',
      title: 'Guida alla Lettura Digitale',
      size: Math.round(dataUrl1.length * 0.75),
      addedAt: new Date().toISOString(),
      url: dataUrl1,
      isSample: true,
    });

    // 2. Il Piccolo Principe - Estratto
    const doc2 = await PDFDocument.create();
    const pagePrin1 = doc2.addPage([595.28, 841.89]);
    pagePrin1.drawText('Il Piccolo Principe', { x: 50, y: 780, size: 24, font: fontBold, color: rgb(0.7, 0.4, 0.1) });
    pagePrin1.drawText('Antoine de Saint-Exupery - Estratto Scelto', { x: 50, y: 745, size: 13, font: fontHelvetica, color: rgb(0.4, 0.4, 0.4) });

    const quoteText = [
      'Capitolo XXI - La Volpe',
      '',
      '«In quel momento apparve la volpe.',
      '— Buongiorno, disse la volpe.',
      '— Buongiorno, rispose cortesemente il piccolo principe, girandosi ma non vide nessuno.',
      '— Sono qui, disse la voce, sotto il melo...',
      '— Chi sei? disse il piccolo principe. Sei molto carino...',
      '— Sono una volpe, disse la volpe.',
      '— Vieni a giocare con me, le propose il piccolo principe, sono cosi triste...',
      '— Non posso giocare con te, disse la volpe. Non sono addomesticata.',
      '— Ah! scusa, fece il piccolo principe.',
      'Ma ci penso sopra e aggiunse:',
      '— Che cosa significa "addomesticare"?»',
      '',
      '«Non si vede bene che col cuore. L\'essenziale e invisibile agli occhi.»'
    ];

    let yPosPrin = 690;
    for (const line of quoteText) {
      if (line.startsWith('Capitolo')) {
        pagePrin1.drawText(line, { x: 50, y: yPosPrin, size: 15, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      } else if (line.startsWith('«Non si vede')) {
        pagePrin1.drawText(line, { x: 50, y: yPosPrin, size: 13, font: fontBold, color: rgb(0.7, 0.3, 0.1) });
      } else {
        pagePrin1.drawText(line, { x: 50, y: yPosPrin, size: 11, font: fontHelvetica, color: rgb(0.25, 0.25, 0.25) });
      }
      yPosPrin -= 22;
    }
    pagePrin1.drawText('Pagina 1 di 1', { x: 260, y: 30, size: 10, font: fontHelvetica, color: rgb(0.5, 0.5, 0.5) });

    const dataUrl2 = await doc2.saveAsBase64({ dataUri: true });
    results.push({
      id: 'Il_Piccolo_Principe_Estratto.pdf',
      filename: 'Il_Piccolo_Principe_Estratto.pdf',
      title: 'Il Piccolo Principe Estratto',
      size: Math.round(dataUrl2.length * 0.75),
      addedAt: new Date().toISOString(),
      url: dataUrl2,
      isSample: true,
    });

    // 3. Manuale Utente
    const doc3 = await PDFDocument.create();
    const pageMan1 = doc3.addPage([595.28, 841.89]);
    pageMan1.drawText('Manuale e Note di Esempio', { x: 50, y: 780, size: 22, font: fontBold, color: rgb(0.2, 0.5, 0.3) });
    pageMan1.drawText('Documento dimostrativo per la tua libreria locale', { x: 50, y: 750, size: 13, font: fontHelvetica, color: rgb(0.4, 0.4, 0.4) });

    const manualText = [
      'Questo e un file dimostrativo salvato nella memoria del tuo browser.',
      'Puoi aggiungere qualsiasi tuo documento personalizzato trascinandolo',
      'nella schermata iniziale oppure selezioandolo dal tuo computer.',
      '',
      'Suggerimenti per la lettura mobile:',
      '1. Tocca due volte la pagina o usa lo slider per regolare il livello di zoom.',
      '2. Attiva la modalita scorrimento continuo per leggere senza interruzioni.',
      '3. Salva i segnalibri per accedere rapidamente ai capitoli importanti.'
    ];

    let yPosMan = 700;
    for (const line of manualText) {
      pageMan1.drawText(line, { x: 50, y: yPosMan, size: 12, font: fontHelvetica, color: rgb(0.2, 0.2, 0.2) });
      yPosMan -= 22;
    }
    pageMan1.drawText('Pagina 1 di 1', { x: 260, y: 30, size: 10, font: fontHelvetica, color: rgb(0.5, 0.5, 0.5) });

    const dataUrl3 = await doc3.saveAsBase64({ dataUri: true });
    results.push({
      id: 'Manuale_Note_Esempio.pdf',
      filename: 'Manuale_Note_Esempio.pdf',
      title: 'Manuale Note Esempio',
      size: Math.round(dataUrl3.length * 0.75),
      addedAt: new Date().toISOString(),
      url: dataUrl3,
      isSample: true,
    });
  } catch (err) {
    console.error('Errore durante la generazione dei PDF di esempio client-side:', err);
  }

  return results;
}
