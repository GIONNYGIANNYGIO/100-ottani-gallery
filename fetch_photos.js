const fs = require('fs');

async function cacciatoreEvoluto() {
  // Lista query per coprire ogni angolo del tuning
  const queries = ['tuning+car', 'modified+car', 'stance+nation', 'jdm+culture', 'widebody+kit', 'supercar+custom', 'drift+car', 'slammed+car'];
  let database = [];

  // Carica archivio esistente per accumulare foto (fino a 20.000)
  if (fs.existsSync('gallery.json')) {
    try { database = JSON.parse(fs.readFileSync('gallery.json', 'utf8')); } catch (e) { database = []; }
  }

  for (const q of queries) {
    try {
      // Usiamo i feed NAPI di Unsplash che sono i più ricchi e facili da filtrare
      const response = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=50`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();

      if (data.results) {
        data.results.forEach(img => {
          const altText = (img.alt_description || img.description || "").toLowerCase();
          
          // --- ANALISI E FILTRO ---
          // Scartiamo tutto ciò che contiene persone o oggetti non pertinenti
          const blacklist = ['person', 'man', 'woman', 'girl', 'boy', 'model', 'food', 'snack', 'candy'];
          const isInvalid = blacklist.some(word => altText.includes(word));

          if (img.urls && img.urls.regular && !isInvalid) {
            database.push({
              u: img.urls.regular, // 'u' invece di 'url' per risparmiare byte (file più leggero)
              a: (img.alt_description || `Auto Tuning ${q.replace('+', ' ')}`).substring(0, 100) + " | 100 Ottani Please!™", // ALT per Google
              s: '100O' // Fonte
            });
          }
        });
      }
    } catch (e) { console.log(`Errore su query ${q}`); }
  }

  // Rimozione doppioni e limite sicurezza
  const unique = [...new Map(database.map(item => [item.u, item])).values()];
  
  // Scrive il JSON finale (molto compatto)
  fs.writeFileSync('gallery.json', JSON.stringify(unique));
  console.log(`Database aggiornato: ${unique.length} foto pronte.`);
}

cacciatoreEvoluto();
