const fs = require('fs');

async function scrapePhotos() {
  const sources = [
    'https://unsplash.com/it/s/foto/tuning-car',
    'https://www.pexels.com/search/automotive/',
    'https://pixabay.com/it/images/search/tuning%20car/'
  ];

  let allImages = [];

  for (const url of sources) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Cerchiamo i link che finiscono con .jpg o .png dentro l'HTML
      const imgRegex = /https:\/\/[^"']+\.(?:jpg|jpeg|png)/g;
      const found = html.match(imgRegex);

      if (found) {
        found.forEach(link => {
          // Filtro: carichiamo solo link che sembrano foto reali e non icone
          if (link.includes('images.unsplash.com') || link.includes('images.pexels.com')) {
            allImages.push({
              url: link,
              title: "Extreme Tuning",
              source: "Live Feed"
            });
          }
        });
      }
    } catch (e) {
      console.log("Errore su: " + url);
    }
  }

  // Rimuoviamo i doppioni e salviamo
  const uniqueImages = [...new Map(allImages.map(item => [item.url, item])).values()];
  fs.writeFileSync('gallery.json', JSON.stringify(uniqueImages.slice(0, 100), null, 2));
  console.log("Trovate " + uniqueImages.length + " foto!");
}

scrapePhotos();
