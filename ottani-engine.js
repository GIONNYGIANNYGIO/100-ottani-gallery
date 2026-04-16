// OTTANI ENGINE V2 - STABILE & FLUIDO
(function() {

    const KEYS = {
        U: "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA",
        P: "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD",
        X: "55464526-8c1ed1d759c73669d0c1f38ab"
    };

    const QUERY = "jdm car tuning night drift modified";
    const grid = document.getElementById('jdm-engine-grid');
    const loader = document.getElementById('jdm-loader');

    let page = 1;
    let loading = false;
    let cache = new Set();

    const styles = ['tile-tall','tile-wide','tile-sm','tile-sm','tile-wide'];

    // ---------------------------
    // FILTRO QUALITÀ (ANTI FAKE)
    // ---------------------------
    function isRealTuning(item) {
        const text = (item.t || "").toLowerCase();

        return (
            text.includes("jdm") ||
            text.includes("tuning") ||
            text.includes("drift") ||
            text.includes("modified") ||
            text.includes("stance") ||
            text.includes("widebody")
        ) &&
        !text.includes("render") &&
        !text.includes("3d") &&
        !text.includes("illustration");
    }

    // ---------------------------
    // FETCH MULTI SOURCE
    // ---------------------------
    async function fetchImages() {

        const results = await Promise.allSettled([
            fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=7&query=${QUERY}&client_id=${KEYS.U}`).then(r => r.json()),
            fetch(`https://api.pexels.com/v1/search?query=${QUERY}&per_page=7&page=${page}`, {
                headers: { Authorization: KEYS.P }
            }).then(r => r.json()),
            fetch(`https://pixabay.com/api/?key=${KEYS.X}&q=${QUERY}&image_type=photo&page=${page}&per_page=6`).then(r => r.json())
        ]);

        let items = [];

        results.forEach((r, i) => {
            if (r.status !== 'fulfilled') return;

            const d = r.value;

            if (i === 0 && d.results) {
                items.push(...d.results.map(m => ({
                    img: m.urls.small,
                    t: m.alt_description,
                    a: m.user.name,
                    s: "Unsplash",
                    l: m.links.html
                })));
            }

            if (i === 1 && d.photos) {
                items.push(...d.photos.map(m => ({
                    img: m.src.large,
                    t: m.alt,
                    a: m.photographer,
                    s: "Pexels",
                    l: m.url
                })));
            }

            if (i === 2 && d.hits) {
                items.push(...d.hits.map(m => ({
                    img: m.webformatURL,
                    t: m.tags,
                    a: m.user,
                    s: "Pixabay",
                    l: m.pageURL
                })));
            }
        });

        return items.filter(isRealTuning);
    }

    // ---------------------------
    // CARD UI
    // ---------------------------
    function createCard(data) {

        if (cache.has(data.img)) return null;
        cache.add(data.img);

        const a = document.createElement('a');
        a.href = data.l;
        a.target = "_blank";

        const style = styles[Math.floor(Math.random() * styles.length)];
        a.className = "jdm-card " + style;

        a.innerHTML = `
            <div class="jdm-tag-new">100 OTTANI</div>
            <div class="jdm-media">
                <img src="${data.img}" loading="lazy"
                     onerror="this.src='fallback.jpg'" alt="JDM CAR">
            </div>

            <div class="jdm-info">
                <div>
                    <div class="jdm-meta-top">
                        <span>SRC_${data.s.toUpperCase()}</span>
                        <span>2026_FILE</span>
                    </div>

                    <h3 class="jdm-title">
                        ${(data.t || "JDM_BUILD").substring(0, 40)}
                    </h3>

                    <div class="jdm-details">
                        <b>AUTHOR:</b> ${data.a}<br>
                        <b>STATUS:</b> VERIFIED
                    </div>
                </div>

                <div class="jdm-footer">
                    <span>VIEW_FILE</span>
                    <span class="jdm-arrow">↗</span>
                </div>
            </div>

            <div class="jdm-bar"></div>
        `;

        return a;
    }

    // ---------------------------
    // LOAD BATCH
    // ---------------------------
    async function loadBatch() {

        if (loading) return;
        loading = true;

        loader.classList.add('active');

        try {
            const data = await fetchImages();

            const fragment = document.createDocumentFragment();

            data.forEach(item => {
                const card = createCard(item);
                if (card) fragment.appendChild(card);
            });

            grid.appendChild(fragment);
            page++;

        } catch (e) {
            console.error("ENGINE ERROR", e);
        }

        loader.classList.remove('active');
        loading = false;
    }

    // ---------------------------
    // INTERSECTION OBSERVER
    // ---------------------------
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            loadBatch();
        }
    }, {
        rootMargin: "300px"
    });

    observer.observe(loader);

    // ---------------------------
    // INIT
    // ---------------------------
    window.initOttaniGallery = function() {
        loadBatch();
    };

})();
