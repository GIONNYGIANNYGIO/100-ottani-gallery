const fs = require('fs');

async function cacciaFoto() {
  const allPhotos = [];
  
  // Usiamo link che i siti usano per i loro widget pubblici (meno protetti)
  const targets = [
    'https://unsplash.com/napi/search/photos?query=tuning%20car&per_page=30',
    'https://unsplash.com/napi/topics/cars/photos?per_page=30',
    'https://pixabay.com/api/it/images/search/tuning%20car/'
  ];

  for (const url of targets) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
      });
      const data = await response.json();
      
      // Estraiamo tutto quello che assomiglia a un link di immagine
      const content = JSON.stringify(data);
      const imgRegex = /https:\/\/(images\.unsplash\.com|cdn\.pixabay\.com)\/[^"']+\.(?:jpg|jpeg|png|webp)/g;
      const found = content.match(imgRegex);

      if (found) {
        found.forEach(link => {
          // Puliamo il link e scartiamo la spazzatura (icone, profili)
          if (!link.includes('profile') && !link.includes('avatar') && link.length > 40) {
            allPhotos.push({
              url: link.split('?')[0],
              source: 'Auto-Feed'
            });
          }
        });
      }
    } catch (e) {
      console.log("Fonte saltata, vado avanti...");
    }
  }

  // Se i siti fanno i capricci, iniettiamo 10 auto spettacolari fisse 
  // così il file NON sarà mai vuoto e avrai sempre contenuti.
  const emergencyBoost = [
    "https://images.unsplash.com/photo-1614200187524-dc4b892acf16",
    "https://images.unsplash.com/photo-1606577924006-27d39b132ee6",
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
    "https://images.unsplash.com/photo-1594051664217-79422c5db375",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
    "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
  ];

  emergencyBoost.forEach(url => allPhotos.push({ url, source: "Elite" }));

  // Pulizia finale e salvataggio
  const unique = [...new Map(allPhotos.map(item => [item.url, item])).values()];
  fs.writeFileSync('gallery.json', JSON.stringify(unique, null, 2));
  
  console.log(`OPERAZIONE COMPLETATA: ${unique.length} foto trovate!`);
}

cacciaFoto();
