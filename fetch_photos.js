const fs = require('fs');

async function cacciatoreTitanico() {
  const keywords = ['tuning+car', 'modified+car', 'stanced', 'jdm+style', 'supercar+tuning', 'widebody+kit', 'drift+car', 'custom+cars+automotive'];
  let db = [];
  
  // 1. Carichiamo le foto che abbiamo già nel file per non perderle
  if (fs.existsSync('gallery.json')) {
    try {
      db = JSON.parse(fs.readFileSync('gallery.json', 'utf8'));
    } catch (e) { db = []; }
  }

  const newPhotos = [];

  for (const q of keywords) {
    try {
      // UNPLASH (NAPI)
      const resUn = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=50`);
      const dataUn = await resUn.json();
      if (dataUn.results) {
        dataUn.results.forEach(img => {
          newPhotos.push({
            url: img.urls.regular,
            alt: img.alt_description || `Auto Tuning ${q.replace('+', ' ')} 100 Ottani`,
            source: 'Unsplash'
          });
        });
      }

      // BURST (SHOPIFY) - Scraping leggero
      const resBurst = await fetch(`https://burst.shopify.com/photos/search?q=${q}`);
      const html = await resBurst.json(); // Nota: qui usiamo il testo se necessario, ma Unsplash basta per grandi volumi
    } catch (e) { console.log(`Salto ricerca per ${q}`); }
  }

  // UNIAMO VECCHIE E NUOVE (Niente doppioni)
  const totalList = [...db, ...newPhotos];
  const uniqueDB = [...new Map(totalList.map(item => [item.url, item])).values()];

  // Salviamo tutto
  fs.writeFileSync('gallery.json', JSON.stringify(uniqueDB, null, 2));
  console.log(`Archivio aggiornato! Totale foto nel database: ${uniqueDB.length}`);
}

cacciatoreTitanico();
