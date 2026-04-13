const fs = require('fs');

async function scrapePhotos() {
  const sources = [
    'https://unsplash.com/it/s/foto/tuning-car',
    'https://www.pexels.com/search/automotive/'
  ];

  let allImages = [];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' } // Facciamo finta di essere un browser vero
      });
      const html = await response.text();
      
      // Cerchiamo i link delle immagini reali (Unsplash e Pexels usano questi formati)
      const imgRegex = /https:\/\/images\.(unsplash|pexels)\.com\/[^"']+\.(?:jpg|jpeg|png|webp)/g;
      const found = html.match(imgRegex);

      if (found) {
        found.forEach(link => {
          // Prendiamo solo immagini grandi (scartiamo icone o avatar)
          if (!link.includes('profile') && !link.includes('avatar')) {
            allImages.push({
              url: link.split('?')[0], // Puliamo il link da codici inutili
              title: "Extreme Tuning",
              source: "Live Feed"
            });
          }
        });
      }
    } catch (e) {
      console.log("Errore nel caricamento di: " + url);
    }
  }

  // Rimuoviamo i doppioni e salviamo massimo 50 foto per iniziare
  const uniqueImages = [...new Map(allImages.map(item => [item.url, item])).values()];
  
  if (uniqueImages.length > 0) {
    fs.writeFileSync('gallery.json', JSON.stringify(uniqueImages.slice(0, 50), null, 2));
    console.log(`Successo! Trovate ${uniqueImages.length} foto.`);
  } else {
    console.log("Non ho trovato foto. Riprovo col prossimo aggiornamento.");
  }
}

scrapePhotos();
