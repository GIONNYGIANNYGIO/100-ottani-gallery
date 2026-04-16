// MOTORE SOLO FOTO (BATCH 20) - 100 OTTANI
(function() {
    const KEYS = {
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
        document.getElementById('jdm-loader').classList.add('active');

        const query = "jdm car night street tuning";
        
        try {
            // Chiamate parallele per 20 foto totali
            const res = await Promise.allSettled([
                fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=7&query=${query}&client_id=${KEYS.U}`).then(r => r.json()),
                fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=7&page=${page}`, {headers:{Authorization:KEYS.P}}).then(r => r.json()),
                fetch(`https://pixabay.com/api/?key=${KEYS.X}&q=${query}&image_type=photo&page=${page}&per_page=6`).then(r => r.json())
            ]);

            const grid = document.getElementById('jdm-engine-grid');
            const fragment = document.createDocumentFragment();

            res.forEach((r, i) => {
                if (r.status === 'fulfilled') {
                    const d = r.value;
                    let items = [];
                    if(i===0 && d.results) items = d.results.map(m => ({img: m.urls.regular, t: m.alt_description, a: m.user.name, s: "Unsplash", l: m.links.html}));
                    if(i===1 && d.photos) items = d.photos.map(m => ({img: m.src.large, t: m.alt, a: m.photographer, s: "Pexels", l: m.url}));
                    if(i===2 && d.hits) items = d.hits.map(m => ({img: m.webformatURL, t: m.tags, a: m.user, s: "Pixabay", l: m.pageURL}));
                    
                    items.forEach(data => {
                        const card = createCard(data);
                        fragment.appendChild(card);
                    });
                }
            });

            grid.appendChild(fragment);
            page++;
        } catch (e) { console.error("Engine Error:", e); }
        finally {
            loading = false;
            document.getElementById('jdm-loader').classList.remove('active');
        }
    };

    function createCard(data) {
        const a = document.createElement('a');
        a.href = data.l;
        a.target = "_blank";
        const style = (count % 4 === 0) ? 'tile-tall' : (count % 4 === 1) ? 'tile-wide' : 'tile-sm';
        a.className = "jdm-card " + style;
        
        a.innerHTML = `
            <div class="jdm-tag-new">100 OTTANI</div>
            <div class="jdm-media"><img src="${data.img}" loading="lazy" alt="JDM"></div>
            <div class="jdm-info">
                <div>
                    <div class="jdm-meta-top"><span>PHOTO_ASSET</span><span>2026_ARCHIVE</span></div>
                    <h3 class="jdm-title">${(data.t || "JDM_VISUAL_FILE").substring(0, 25)}</h3>
                    <div class="jdm-details"><b>AUTHOR:</b> ${data.a}<br><b>SRC:</b> ${data.s}</div>
                </div>
                <div class="jdm-footer"><span style="font-size:9px;color:#444">VIEW_FULL_RES</span><span class="jdm-arrow">↗</span></div>
            </div>
            <div class="jdm-bar"></div>
        `;
        count++;
        return a;
    }
})();
