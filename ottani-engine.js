/**
 * 100 OTTANI - PRO ENGINE v2.0
 * Gestione asincrona, pre-caricamento e rendering fluido
 */
(function() {
    const API_KEYS = {
        U: "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA",
        P: "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD",
        X: "55464526-8c1ed1d759c73669d0c1f38ab"
    };

    let page = 1;
    let loading = false;
    let count = 0;

    window.initOttaniGallery = async function() {
        if (loading) return;
        loading = true;
        
        const loader = document.getElementById('jdm-loader');
        if(loader) loader.classList.add('active');

        const q = "jdm car tuning modified night street aesthetic";
        const grid = document.getElementById('jdm-engine-grid');
        
        try {
            const results = await Promise.allSettled([
                fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=12&query=${q}&client_id=${API_KEYS.U}`).then(r => r.json()),
                fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=12&page=${page}`, {headers:{Authorization:API_KEYS.P}}).then(r => r.json()),
                fetch(`https://pixabay.com/api/?key=${API_KEYS.X}&q=${encodeURIComponent(q)}&image_type=photo&per_page=12&page=${page}`).then(r => r.json())
            ]);

            const fragment = document.createDocumentFragment();

            results.forEach((r, i) => {
                if(r.status === 'fulfilled') {
                    const d = r.value;
                    let items = [];
                    if(i===0 && d.results) items = d.results.map(m => ({img: m.urls.regular, t: m.alt_description, a: m.user.name, s: "Unsplash", l: m.links.html}));
                    if(i===1 && d.photos) items = d.photos.map(m => ({img: m.src.large, t: m.alt, a: m.photographer, s: "Pexels", l: m.url}));
                    if(i===2 && d.hits) items = d.hits.map(m => ({img: m.webformatURL, t: m.tags, a: m.user, s: "Pixabay", l: m.pageURL}));
                    
                    items.forEach(data => {
                        fragment.appendChild(createCard(data));
                    });
                }
            });

            grid.appendChild(fragment);
            page++;
        } catch(e) {
            console.warn("Stream error:", e);
        } finally {
            loading = false;
            if(loader) loader.classList.remove('active');
        }
    };

    function createCard(data) {
        const a = document.createElement('a');
        a.href = data.l;
        a.target = "_blank";
        a.rel = "noopener";
        
        const layoutClass = (count % 4 === 0) ? 'tile-tall' : (count % 4 === 1) ? 'tile-wide' : 'tile-sm';
        a.className = `jdm-card ${layoutClass}`;
        
        a.innerHTML = `
            <div class="jdm-tag-new">100 OTTANI</div>
            <div class="jdm-media"><img src="${data.img}" loading="lazy" alt="JDM Asset"></div>
            <div class="jdm-info">
                <div>
                    <div class="jdm-meta-top"><span>SRC_${data.s.toUpperCase()}</span><span>2026_ARCHIVE</span></div>
                    <h3 class="jdm-title">${(data.t || "JDM_VISUAL_FILE").substring(0, 30)}</h3>
                    <div class="jdm-details"><b>AUTHOR:</b> ${data.a}<br><b>STATUS:</b> VERIFIED</div>
                </div>
                <div class="jdm-footer">
                    <span style="font-size:8px;color:#555;letter-spacing:1px">VIEW_FILE</span>
                    <span class="jdm-arrow">↗</span>
                </div>
            </div>
            <div class="jdm-bar"></div>
        `;
        count++;
        return a;
    }

    // Auto-init al caricamento
    const observer = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) window.initOttaniGallery();
    }, { rootMargin: '400px' });

    document.addEventListener('DOMContentLoaded', () => {
        const trigger = document.getElementById('jdm-trigger');
        if(trigger) observer.observe(trigger);
        window.initOttaniGallery();
    });
})();
