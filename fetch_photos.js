const PEXELS_KEY = "LA_TUA_PEXELS_KEY";
const PIXABAY_KEY = "LA_TUA_PIXABAY_KEY";
const UNSPLASH_KEY = "LA_TUA_UNSPLASH_KEY";

const gallery = document.getElementById("gallery");

const queries = [
  "jdm car no people",
  "modified car street empty",
  "supercar night no people",
  "stance car parking",
  "drift car track empty"
];

function randomQuery() {
  return queries[Math.floor(Math.random() * queries.length)];
}

function isClean(img) {
  const text = (img.alt || "").toLowerCase();
  return !text.includes("person") &&
         !text.includes("man") &&
         !text.includes("woman");
}

async function loadImages() {
  const query = randomQuery();
  let images = [];

  // PEXELS
  const pexels = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=10`,
    { headers: { Authorization: PEXELS_KEY } }
  ).then(res => res.json());

  images.push(...pexels.photos.map(p => ({
    url: p.src.medium,
    alt: p.alt
  })));

  // PIXABAY
  const pixabay = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&per_page=10`
  ).then(res => res.json());

  images.push(...pixabay.hits.map(p => ({
    url: p.webformatURL,
    alt: p.tags
  })));

  // UNSPLASH
  const unsplash = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=10`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`
      }
    }
  ).then(res => res.json());

  images.push(...unsplash.results.map(p => ({
    url: p.urls.small,
    alt: p.alt_description
  })));

  images = images.filter(isClean);

  images.sort(() => Math.random() - 0.5);

  render(images);
}

function render(images) {
  images.forEach(img => {
    const el = document.createElement("img");
    el.src = img.url;
    el.loading = "lazy";
    gallery.appendChild(el);
  });
}

// AVVIO
loadImages();
