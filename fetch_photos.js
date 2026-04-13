const fs = require('fs');

async function cacciatoreEvoluto() {
  const queries = ['tuning-car', 'modified-supercar', 'stanced-jdm', 'race-car-action'];
  let grezzo = [];

  // 1. SCARICO MASSIVO
  for (const q of queries) {
    try {
      const r = await fetch(`https://unsplash.com/napi/search/photos?query=${q}&per_page=50`);
      const j = await r.json();
      if (j.results) grezzo.push(...j.results);
    } catch (e) { console.log("Errore scarico"); }
  }

  // 2. FILTRAGGIO INTERNO CATTIVO
  // Qui decidiamo cosa NON vogliamo vedere assolutamente
  const blacklist = ['food', 'snack', 'candy', 'chocolate', 'person', 'woman', 'man', 'child', 'inside', 'interior', 'dashboard'];
  
  const pulito = grezzo.reduce((acc, img) => {
    const descrizione = (img.alt_description || img.description || "").toLowerCase();
    
    // Controlla se la descrizione contiene robaccia della blacklist
    const contieneSchifezze = blacklist.some(parola => descrizione.includes(parola));
    
    // Se è pulita e non l'abbiamo già inserita (per URL unico)
    if (!contieneSchifezze && img.urls && img.urls.regular) {
      if (!acc.find(item => item.u === img.urls.regular)) {
        acc.push({
          u: img.urls.regular, 
          a: (img.alt_description || "Auto Tuning 100 Ottani").substring(0, 80)
        });
      }
    }
    return acc;
  }, []);

  // 3. GENERAZIONE JSON PULITO
  fs.writeFileSync('gallery.json', JSON.stringify(pulito));
  console.log(`Analisi finita. Scaricate ${grezzo.length}, ma salvate solo ${pulito.length} foto di motori.`);
}

cacciatoreEvoluto();
