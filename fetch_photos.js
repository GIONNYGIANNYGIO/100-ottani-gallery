const fs = require('fs');

async function cacciatoreTitanico() {
  const queries = ['tuning-car', 'jdm-cars', 'supercars', 'modified-cars', 'race-cars', 'stanced-cars'];
  let database = [];

  // Legge il database esistente per non perdere i progressi
  if (fs.existsSync('gallery.json')) {
    try {
      const content = fs.readFileSync('gallery.json', 'utf8');
      database = JSON.parse(content);
    } catch (e) { database = []; }
  }

  console.log(`Partenza con ${database.length} foto in archivio...`);

  for (const q of queries) {
    try {
      // Usiamo il feed pubblico "NAPI" che restituisce 30 foto alla volta
      const response = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=30`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();

      if (data.results) {
        data.results.forEach(img => {
          const altText = (img.alt_description || img.description || "").toLowerCase();
          
          // FILTRO: Niente persone, niente cibo, solo metallo
          const blacklist = ['person', 'woman', 'man', 'model', 'food', 'candy', 'snack'];
          const isInvalid = blacklist.some(word => altText.includes(word));

          if (img.urls && img.urls.regular && !isInvalid) {
            // Salviamo con nomi corti per tenere il file leggero (u=url, a=alt)
            database.push({
              u: img.urls.regular,
              a: (img.alt_description || `Auto Tuning ${q} 100 Ottani`).substring(0, 100),
              s: 'UN'
            });
          }
        });
      }
    } catch (e) { console.log(`Blocco su ${q}, salto...`); }
  }

  // Rimuove i duplicati (basandosi sull'URL)
  const uniqueDB = [...new Map(database.map(item => [item.u, item])).values()];

  // Scrive il file finale
  fs.writeFileSync('gallery.json', JSON.stringify(uniqueDB));
  console.log(`Missione compiuta! Ora hai ${uniqueDB.length} foto in archivio.`);
}

cacciatoreTitanico();
