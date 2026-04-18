(async function() {

    const grid = document.getElementById('home-engine-grid');
    if (!grid) return;

    grid.innerHTML = "Loading...";

    try {
        const res = await fetch("https://api.allorigins.win/raw?url=https://100ottaniplease.com/pages/visual");
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // PRENDE SOLO LE CARD REALI DELLA PAGINA VISUAL
        const cards = [...doc.querySelectorAll(".jdm-ss-card")];

        // SOLO LE PRIME 10 (ultime pubblicate)
        const latest = cards.slice(0, 10);

        grid.innerHTML = "";

        latest.forEach((cardEl, i) => {
            const img = cardEl.querySelector("img")?.src;
            const link = cardEl.querySelector("a")?.href;

            const card = document.createElement('article');
            card.className = "jdm-ss-card";

            card.innerHTML = `
                <a href="${link}" target="_blank" style="display:block;height:100%;">
                    <div class="jdm-ss-media">
                        <img src="${img}" loading="lazy">
                    </div>
                    <div class="jdm-ss-body">
                        <div style="font-size:8px;color:#555;margin-bottom:5px;">LIVE // VISUAL</div>
                        <h2 class="jdm-ss-title">LATEST DROP</h2>
                        <div class="jdm-ss-meta">
                            <span style="color:var(--accent)">VIEW</span>
                            <span>#${i+1}</span>
                        </div>
                    </div>
                    <div class="jdm-ss-bar"></div>
                </a>
            `;

            grid.appendChild(card);
        });

    } catch(e) {
        console.error(e);
        grid.innerHTML = "Errore caricamento";
    }

})();
