(function() {
    const API_KEYS = {
        U: "1yLiYWVhE_HAY7MxFPGo3B4-9WfzmWj1R-VPaBTbNVA",
        P: "2xbI4WF3YWnE66DEPr6gEJCNh4iuMyknemXRxw8WAanVE3kSMflm0KmD",
        X: "55464526-8c1ed1d759c73669d0c1f38ab"
    };

    let page = 1;
    let loading = false;
    let count = 0;

    // Observer per caricare/scaricare le immagini dalla memoria (Lazy Render)
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const img = entry.target.querySelector('img');
            if (entry.isIntersecting) {
                if (img && img.dataset.src) {
                    img.src = img.dataset.src; // Carica solo se visibile
                    entry.target.style.opacity = "1";
                }
            } else {
                if (img) img.src = ""; // Scarica dalla RAM se esce dalla vista
                entry.target.style.opacity = "0";
            }
        });
    }, { rootMargin: '200px' });

    window.initOttaniGallery = async function() {
        if (loading) return;
        loading = true;
        document.getElementById('jdm-loader').classList.add('active');

        const q = "jdm car night street tuning aesthetic";
        try {
            const res = await Promise.allSettled([
                fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=12&query=${q}&client_id=${API_KEYS.U}`).then(r => r.json()),
                fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=12&page=${page}`, {headers:{Authorization:API_KEYS.P}}).then(r => r.json()),
                fetch(`https://pixabay.com/api/?key=${API_KEYS.X}&q=${encodeURIComponent(q)}&image_type=photo&per_page=12&page=${page}`).then(r => r.json())
            ]);

            const grid = document.getElementById('jdm-engine-grid');
            const fragment = document.createDocumentFragment();

            res.forEach((r, i) => {
                if(r.status === 'fulfilled') {
                    const d = r.value;
                    let items = [];
                    if(i===0 && d.results) items = d.results.map(m => ({img: m.urls.regular, t: m.alt_description, a: m.user.name, s: "Unsplash", l: m.links.html, d: "APR_2026"}));
                    if(i===1 && d.photos) items = d.photos.map(m => ({img: m.src.large, t: m.alt, a: m.photographer, s: "Pexels", l: m.url, d: "APR_2026"}));
                    if(i===2 && d.hits) items = d.hits.map(m => ({img: m.webformatURL, t: m.tags, a: m.user, s: "Pixabay", l: m.pageURL, d: "APR_2026"}));
                    
                    items.forEach(data => {
                        const card = createCard(data);
                        fragment.appendChild(card);
                        cardObserver.observe(card); // Attiva il riciclo memoria
                    });
                }
            });

            grid.appendChild(fragment);
            page++;
        } catch(e) {} finally {
            loading = false;
            document.getElementById('jdm-loader').classList.remove('active');
        }
    };

    function createCard(data) {
        const a = document.createElement('a');
        a.href = data.l;
        a.target = "_blank";
        const layoutClass = (count % 4 === 0) ? 'tile-tall' : (count % 4 === 1) ? 'tile-wide' : 'tile-sm';
        a.className = `jdm-card ${layoutClass}`;
        
        a.innerHTML = `
            <div class="jdm-tag-new">100 OTTANI</div>
            <div class="jdm-media"><img data-src="${data.img}" src="" alt="JDM"></div>
            <div class="jdm-info">
                <div class="jdm-info-inner">
                    <div class="jdm-meta-top">
                        <span>SOURCE: ${data.s.toUpperCase()}</span>
                        <span>DATE: ${data.d}</span>
                    </div>
                    <h3 class="jdm-title">NAME: ${ (data.t || "ASSET_UNNAMED").substring(0, 20) }</h3>
                    <div class="jdm-details">
                        <b>AUTHOR:</b> ${data.a}<br>
                        <b>STATUS:</b> CRYPT_VERIFIED<br>
                        <b>CORE:</b> DIGITAL_MOTION
                    </div>
                </div>
                <div class="jdm-footer">
                    <span class="jdm-view-text">VIEW_ASSET</span>
                    <span class="jdm-arrow">↗</span>
                </div>
            </div>
            <div class="jdm-bar"></div>
        `;
        count++;
        return a;
    }

    const triggerObs = new IntersectionObserver(e => { if(e[0].isIntersecting) window.initOttaniGallery(); }, {rootMargin:'400px'});
    document.addEventListener('DOMContentLoaded', () => {
        triggerObs.observe(document.getElementById('jdm-trigger'));
        window.initOttaniGallery();
    });
})();
