const fs = require('fs');

async function scrape() {
  // Usiamo una fonte più diretta per il test
  const url = 'https://unsplash.com/napi/search/photos?query=tuning%20car&per_page=30';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Prendiamo solo i link delle foto
    const photos = data.results.map(p => ({
      url: p.urls.regular,
      title: p.alt_description || "Modified Car",
      source: "Unsplash"
    }));

    if (photos.length > 0) {
      fs.writeFileSync('gallery.json', JSON.stringify(photos, null, 2));
      console.log(`Trovate ${photos.length} foto!`);
    } else {
      console.log("Nessuna foto trovata.");
    }
  } catch (error) {
    console.error("Errore script:", error);
  }
}

scrape();
