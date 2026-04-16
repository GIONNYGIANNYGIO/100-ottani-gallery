const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 🔑 API KEYS
const PIXABAY_KEY = "55464526-8c1ed1d759c73669d0c1f38ab";
const PEXELS_KEY = "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD";
const UNSPLASH_KEY = "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA";

// 🎯 QUERY TUNING REALI
const queries = [
  "jdm car modified",
  "stance car real",
  "tuning car street",
  "modified car real life",
  "widebody car real",
  "drift car real",
  "lowered car stance"
];

// 🚫 NO PERSONE
function isClean(text) {
  if (!text) return true;
  text = text.toLowerCase();
  const banned = ["person","people","man","woman","girl","boy","driver","crowd","human"];
  return !banned.some(word => text.includes(word));
}

// ❌ NO FAKE
function isRealCar(text) {
  if (!text) return false;
  text = text.toLowerCase();
  const banned = ["render","3d","illustration","concept","prototype","ai","generated","game","forza","gran turismo"];
  return !banned.some(word => text.includes(word));
}

// 🔥 SOLO TUNING
function isTuning(text) {
  if (!text) return false;
  text = text.toLowerCase();
  const good = ["modified","tuning","stance","lowered","widebody","drift","jdm"];
  return good.some(word => text.includes(word));
}

function isValid(text) {
  return isClean(text) && isRealCar(text) && isTuning(text);
}

async function fetchImages() {
  let images = [];

  const selectedQueries = queries.sort(() => 0.5 - Math.random()).slice(0, 3);

  for (const query of selectedQueries) {

    // 🟡 PIXABAY
    const pixabayRes = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&category=transportation&image_type=photo&per_page=40`
    );
    const pixabay = await pixabayRes.json();

    images.push(...pixabay.hits
      .filter(p => isValid(p.tags))
      .map(p => ({
        url: p.webformatURL,
        author: p.user,
        date: "Pixabay"
      }))
    );

    // 🟢 PEXELS
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=40`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    const pexels = await pexelsRes.json();

    images.push(...pexels.photos
      .filter(p => isValid(p.alt))
      .map(p => ({
        url: p.src.large,
        author: p.photographer,
        date: "Pexels"
      }))
    );

    // 🔵 UNSPLASH
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=40`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const unsplash = await unsplashRes.json();

    images.push(...unsplash.results
      .filter(p => isValid(p.alt_description))
      .map(p => ({
        url: p.urls.regular,
        author: p.user.name,
        date: p.created_at
      }))
    );
  }

  // 🔁 merge con vecchio
  let existing = [];
  if (fs.existsSync("gallery.json")) {
    existing = JSON.parse(fs.readFileSync("gallery.json"));
  }

  const all = [...existing, ...images];

  const unique = new Map();
  all.forEach(img => unique.set(img.url, img));

  const finalImages = [...unique.values()].sort(() => Math.random() - 0.5);

  fs.writeFileSync("gallery.json", JSON.stringify(finalImages, null, 2));

  console.log("Gallery aggiornata:", finalImages.length);
}

fetchImages();
