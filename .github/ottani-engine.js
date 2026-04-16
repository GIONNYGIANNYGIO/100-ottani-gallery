// GitHub: ottani-engine.js
(function() {
    const API_KEYS = {
        U: "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA",
        P: "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD",
        X: "55464526-8c1ed1d759c73669d0c1f38ab"
    };

    let page = 1;
    let isFetching = false;
    const BATCH_SIZE = 20; // Carichiamo 20 immagini alla volta

    window.loadOttaniGallery = async function() {
        if (isFetching) return;
        isFetching = true;
        
        const loader = document.getElementById('jdm-loader');
        if (loader) loader.classList.add('active');

        const query = "jdm car tuning night street";
        const grid = document.getElementById('jdm-engine-grid');
        const fragment = document.createDocumentFragment(); // Ottimizzazione: carichiamo tutto insieme alla fine

        try {
            // Chiamate parallele alle API
            const responses = await Promise.allSettled([
                fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=7&query=${query}&client_id=${API_KEYS.U}`).then(r => r.json()),
                fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=7&page=${page}`, { headers: { Authorization: API_KEYS.P } }).then(r => r.json()),
                fetch(`https://pixabay.com/api/?key=${API_KEYS.X}&q=${query}&image_type=photo&page=${page}&per_page=6`).then(r => r.json())
            ]);

            let combinedData = [];

            responses.forEach((res, i) => {
                if (res.status === 'fulfilled' && res.value) {
                    if (i === 0 && res.value.results) combinedData.push(...res.value.results.map(m => ({img: m.urls.small, t: m.alt_description, a: m.user.name, s: 'Unsplash', l: m.links.html})));
                    if (i === 1 && res.value.photos) combinedData.push(...res.value.photos.map(m => ({img: m.src.large, t: m.alt, a: m.photographer, s: 'Pexels', l: m.url})));
                    if (i === 2 && res.value.hits) combinedData.push(...res.value.hits.map(m => ({img: m.webformatURL, t: m.tags, a: m.user, s: 'Pixabay', l: m.pageURL})));
                }
            });

            // Rendering di 20 card
            combinedData.slice(0, BATCH_SIZE).forEach((data, index) => {
                const count = grid.children.length + index;
                const card = createCardElement(data, count);
                fragment.appendChild(card);
            });

            grid.appendChild(fragment);
            page++;
        } catch (e) {
            console.error("Engine Error:", e);
        } finally {
            isFetching = false;
            if (loader) loader.classList.remove('active');
        }
    };

    function createCardElement(data, count) {
        const a = document.createElement('a');
        a.href = data.l;
        a.target = "_blank";
        const style = (count % 4 === 0) ? 'tile-tall' : (count % 4 === 1) ? 'tile-wide' : 'tile-sm';
        a.className = `jdm-card ${style}`;
        
        // Lazy loading nativo e placeholder per fluidità
        a.innerHTML = `
            <div class="jdm-tag-new">100 OTTANI</div>
            <div class="jdm-media">
                <img src="${data.img}" loading="lazy" alt="JDM Asset">
            </div>
            <div class="jdm-info">
                <div class="jdm-meta-top"><span>ARCHIVE_${data.s.toUpperCase()}</span><span>2026</span></div>
                <h3 class="jdm-title">${(data.t || "JDM_FILE").substring(0, 25)}</h3>
                <div class="jdm-details"><b>AUTHOR:</b> ${data.a}</div>
                <div class="jdm-footer"><span>VIEW_ASSET</span><span class="jdm-arrow">↗</span></div>
            </div>
            <div class="jdm-bar"></div>
        `;
        return a;
    }
})();
