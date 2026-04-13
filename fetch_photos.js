const fs = require('fs');

async function getCarPhotos() {
  const allPhotos = [];
  
  // Fonti dirette che raramente bloccano
  const sources = [
    'https://unsplash.com/napi/topics/cars/photos?per_page=35',
    'https://unsplash.com/napi/search/photos?query=tuning-car&per_page=35'
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      const results = data.results || data; // Unsplash usa strutture diverse tra search e topic

      if (Array.isArray(results)) {
        results.forEach(img => {
          // Filtro anti-persone basato sulle parole chiave dell'immagine
          const description = (img.alt_description || img.description || "").toLowerCase();
          const forbidden = ['man', 'woman', 'girl', 'boy', 'person', 'people', 'model'];
          
          if (!forbidden.some(word => description.includes(word))) {
            allPhotos.push({
              url: img.urls.regular,
              source: 'Unsplash',
              title: img.alt_description || 'Modified Car'
            });
          }
        });
      }
    } catch (e) {
      console.log("Salto una fonte per blocco temporaneo...");
    }
  }

  // Se lo script fallisce e non trova nulla, carichiamo almeno un set di 10 foto fisse di alta qualità
  // Così il tuo sito non resta mai vuoto.
  if (allPhotos.length === 0) {
    const backup = [
      { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2", source: "System" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7", source: "System" },
      { url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888", source: "System" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70", source: "System" }
    ];
    fs.writeFileSync('gallery.json', JSON.stringify(backup, null, 2));
  } else {
    // Rimuoviamo i duplicati
    const uniquePhotos = [...new Map(allPhotos.map(item => [item.url, item])).values()];
    fs.writeFileSync('gallery.json', JSON.stringify(uniquePhotos, null, 2));
    console.log(`Successo! Trovate ${uniquePhotos.length} foto.`);
  }
}

getCarPhotos();
