const fs = require('fs');

async function getPhotos() {
  const sources = [
    // Sorgente Unsplash (Argomento Auto)
    'https://unsplash.com/napi/topics/cars/photos?per_page=30',
    // Sorgente Pixabay (Ricerca diretta)
    'https://pixabay.com/api/it/images/search/tuning%20car/'
  ];

  let results = [];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();
      
      // Se è Unsplash
      if (Array.isArray(data)) {
        data.forEach(img => {
          results.push({ url: img.urls.regular, source: 'Unsplash' });
        });
      } 
      // Se è Pixabay
      else if (data.hits) {
        data.hits.forEach(img => {
          results.push({ url: img.largeImageURL, source: 'Pixabay' });
        });
      }
    } catch (e) {
      console.log("Errore caricamento fonte");
    }
  }

  // Se non trova nulla, mettiamo dei link sicuri per sbloccare il file
  if (results.length === 0) {
    results = [
      { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2", source: "Backup" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7", source: "Backup" }
    ];
  }

  fs.writeFileSync('gallery.json', JSON.stringify(results, null, 2));
}

getPhotos();
