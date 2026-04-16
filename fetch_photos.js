const fs = require('fs');

async function cacciatoreEvoluto() {
  const queries = ['tuning-car', 'modified-supercar', 'stanced-jdm', 'race-car-action'];
  let grezzo = [];

  for (const q of queries) {
    // --- FONTE 1: UNSPLASH ---
    try {
      const r1 = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=30`);
      const j1 = await r1.json();
      if (j1.results) {
        j1.results.forEach(img => grezzo.push({
          url: img.urls.regular,
          alt: img.alt_description || "Auto Tuning 100 Ottani"
        }));
      }
    } catch (e) { console.log("Errore Unsplash"); }

    // --- FONTE 2: PEXELS ---
    try {
      const r2 = await fetch(`https://www.pexels.com/it-it/api/v3/search/photos?query=${q}&per_page=30`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const j2 = await r2.json();
      if (j2.photos) {
        j2.photos.forEach(img => grezzo.push({
          url: img.src.large,
          alt: img.alt || "Auto Tuning 100 Ottani"
        }));
      }
    } catch (e) { console.log("Errore Pexels"); }
  }

  // --- FILTRAGGIO CATTIVO ---
  const blacklist = ['food', 'person', 'woman', 'man', 'child', 'interior', 'dashboard', 'office'];
  
  const pulito = grezzo.reduce((acc, img) => {
    const desc = (img.alt || "").toLowerCase();
    const contieneSchifezze = blacklist.some(p => desc.includes(p));
    
    if (!contieneSchifezze && img.url) {
      // Evita duplicati
      if (!acc.find(item => item.u === img.url)) {
        acc.push({
          u: img.url, 
          a: desc.substring(0, 80)
        });
      }
    }
    return acc;
  }, []);

  fs.writeFileSync('gallery.json', JSON.stringify(pulito));
  console.log(`Analisi finita. Salvate ${pulito.length} foto.`);
}

cacciatoreEvoluto();
