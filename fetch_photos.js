const fs = require('fs');

async function getCarPhotos() {
  const queries = ['tuning+car', 'modified+car', 'stanced+car', 'widebody+car'];
  const allPhotos = [];

  for (const query of queries) {
    try {
      // Peschiamo da Unsplash (via API pubblica senza chiave)
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=20`);
      const data = await res.json();
      
      if (data.results) {
        data.results.forEach(img => {
          // Filtriamo per scartare foto con persone nei tag
          const tags = img.alt_description?.toLowerCase() || "";
          if (!tags.includes('person') && !tags.includes('woman') && !tags.includes('man')) {
            allPhotos.push({
              url: img.urls.regular,
              source: 'Unsplash',
              title: img.alt_description || 'Extreme Tuning'
            });
          }
        });
      }
    } catch (e) { console.log("Errore ricerca: " + query); }
  }

  // Rimuovi i duplicati
  const uniquePhotos = [...new Map(allPhotos.map(item => [item.url, item])).values()];

  if (uniquePhotos.length > 0) {
    fs.writeFileSync('gallery.json', JSON.stringify(uniquePhotos, null, 2));
    console.log(`Successo! Trovate ${uniquePhotos.length} foto reali.`);
  }
}

getCarPhotos();
