const fs = require("fs");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const PIXABAY_KEY = "INSERISCI_LA_TUA_KEY_QUI";

async function fetchImages() {
  const res = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=car+no+people&image_type=photo&per_page=20`
  );

  const data = await res.json();

  const images = data.hits.map(img => ({
    url: img.webformatURL
  }));

  fs.writeFileSync("gallery.json", JSON.stringify(images, null, 2));
}

fetchImages();
