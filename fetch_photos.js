const fs = require('fs');

async function getCarPhotos() {
  const sources = [
    { name: 'Unsplash', url: 'https://unsplash.com/napi/search/photos?query=tuning%20car&per_page=30' },
    { name: 'Pexels', url: 'https://www.pexels.com/it-it/cerca/tuning%20car/' },
    { name: 'Pixabay', url: 'https://pixabay.com/it/images/search/tuning%20car/' },
    { name: 'Burst', url: 'https://burst.shopify.com/photos/search?q=car+tuning' }
  ];

  let allPhotos = [];

  for (const site of sources) {
    try {
      console.log(`Analizzando: ${site.name}...`);
      const response = await fetch(site.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      
      const text = await response.text();
      
      // Questa "calamita" (Regex) pesca i link diretti alle immagini dai 4 siti
      const imgRegex = /https:\/\/images\.(unsplash|pexels|pixabay)\.com\/[^"']+\.(?:jpg|jpeg|png|webp)/g;
      const found = text.match(imgRegex);

      if (found) {
        found.forEach(link => {
          // Filtro: niente persone, solo immagini grandi
          if (!link.includes('profile') && !link.includes('avatar') && !link.includes('users')) {
            allPhotos.push({
              url: link.split('?')[0], // Puliamo il link
              source: site.name,
              title: "100 Ottani Extreme Selection"
            });
          }
        });
      }
    } catch (e) {
      console.log(`Errore su ${site.name}:`, e.message);
    }
  }

  // Rimuoviamo i doppioni
  const uniquePhotos = [...new Map(allPhotos.map(item => [item.url, item])).values()];

  if (uniquePhotos.length > 0) {
    fs.writeFileSync('gallery.json', JSON.stringify(uniquePhotos, null, 2));
    console.log(`Successo! Ho caricato ${uniquePhotos.length} foto dai tuoi 4 siti.`);
  } else {
    console.log("Ancora nessun dato trovato. Verifica i permessi di scrittura di GitHub.");
  }
}

getCarPhotos();
