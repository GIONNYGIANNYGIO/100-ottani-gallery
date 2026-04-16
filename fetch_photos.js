const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 🔑 API KEYS
const PIXABAY_KEY = "55464526-8c1ed1d759c73669d0c1f38ab";
const PEXELS_KEY = "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD";
const UNSPLASH_KEY = "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA";

// 🎯 QUERY SOLO TUNING REALI
const queries = [
  "jdm car modified",
  "stance car real",
  "tuning car street",
  "modified car real life",
  "widebody car real",
  "drift car real",
  "lowered car stance"
];

function randomQuery() {
  return queries[Math.floor(Math.random() * queries.length)];
}

// 🚫 NO PERSONE
function isClean(text) {
  if (!text) return true;
  text = text.toLowerCase();

  const banned = [
    "person","people","man","woman","girl","boy","driver","crowd","human"
  ];

  return !banned.some(word => text.includes(word));
}

// ❌ NO FAKE / AI / CONCEPT
function isRealCar(text) {
  if (!text) return false;
  text = text.toLowerCase();

  const banned = [
    "render","3d","illustration","concept","prototype",
    "futuristic","ai","generated","cyberpunk",
    "virtual","game","forza","gran turismo"
  ];

  return !banned.some(word => text.includes(word));
}

// 🔥 SOLO TUNING
function isTuning(text) {
  if (!text) return false;
  text = text.toLowerCase();

  const good = [
    "modified","tuning","stance","lowered","widebody","drift","jdm"
  ];

  return good.some(word => text.includes(word));
}

function isValid(text) {
  return isClean(text) && isRealCar(text) && isTuning(text);
}

async function fetchImages() {
  const query = randomQuery();
  let images = [];

  // 🟡 PIXABAY
  const pixabayRes = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&category=transportation&image_type=photo&per_page=20`
  );
  const pixabay = await pixabayRes.json();

  images.push(...pixabay.hits
    .filter(p => isValid(p.tags))
    .map(p => ({ url: p.webformatURL }))
  );

  // 🟢 PEXELS
  const pexelsRes = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=20`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  const pexels = await pexelsRes.json();

  images.push(...pexels.photos
    .filter(p => isValid(p.alt))
    .map(p => ({ url: p.src.large }))
  );

  // 🔵 UNSPLASH
  const unsplashRes = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=20`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`
      }
    }
  );
  const unsplash = await unsplashRes.json();

  images.push(...unsplash.results
    .filter(p => isValid(p.alt_description))
    .map(p => ({ url: p.urls.regular }))
  );

  // 🔁 REMOVE DUPLICATES
  const unique = new Map();
  images.forEach(img => unique.set(img.url, img));
  let finalImages = [...unique.values()];

  // 🎲 RANDOM
  finalImages.sort(() => Math.random() - 0.5);

  // 💾 SAVE
  fs.writeFileSync("gallery.json", JSON.stringify(finalImages, null, 2));

  console.log("Gallery aggiornata:", finalImages.length);
}

fetchImages();
