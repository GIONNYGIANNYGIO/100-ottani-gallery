const fs = require('fs');

async function scaricaEFiltra() {
  // Query pesanti per massimizzare il pescato
  const queries = ['tuning+car', 'modified+car', 'supercar', 'jdm+style', 'stance+car', 'drift+racing'];
  let databaseGrezzo = [];
  
  // 1. SCARICO TOTALE
  for (const q of queries) {
    try {
      const response = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=50`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const data = await response.json();
      if (data.results) databaseGrezzo.push(...data.results);
    } catch (e) { console.log("Errore scarico query: " + q); }
  }

  // 2. FILTRAGGIO INTERNO (Analisi dei dati scaricati)
  const databasePulito = databaseGrezzo.reduce((acc, img) => {
    const desc = (img.alt_description || img.description || "").toLowerCase();
    
    // Lista nera: se una di queste parole è presente, la foto viene scartata
    const blacklist = ['person', 'man', 'woman', 'girl', 'boy', 'model', 'food', 'snack', 'candy', 'interior'];
    const haPersoneOCibo = blacklist.some(word => desc.includes(word));

    // Se la foto è pulita e non l'abbiamo già aggiunta (controllo ID)
    if (!haPersoneOCibo && img.urls && img.urls.regular) {
      const esisteGia = acc.find(item => item.u === img.urls.regular);
      if (!esisteGia) {
        acc.push({
          u: img.urls.regular, // URL pulito
          a: (img.alt_description || "Auto Tuning 100 Ottani").substring(0, 80), // ALT per SEO
          s: "100-Ottani-Verify" // Tag di verifica
        });
      }
    }
    return acc;
  }, []);

  // 3. GENERAZIONE JSON LEGGERO
  // Salviamo in formato compresso per non rallentare Fourthwall
  fs.writeFileSync('gallery.json', JSON.stringify(databasePulito));
  
  console.log(`--- ANALISI COMPLETATA ---`);
  console.log(`Foto analizzate: ${databaseGrezzo.length}`);
  console.log(`Foto approvate e salvate: ${databasePulito.length}`);
}

scaricaEFiltra();
