import fs from "fs";

const PIXABAY_KEY = "55464526-8c1ed1d759c73669d0c1f38ab";

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
