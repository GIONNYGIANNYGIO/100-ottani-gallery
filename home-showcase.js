(function(){

    const pattern = ['full','wide','narrow','narrow','wide','full','wide','narrow','narrow','wide'];

    async function loadHomeGallery(){
        const grid = document.getElementById('home-engine-grid');
        if(!grid) return;

        grid.innerHTML = "Loading...";

        try{
            const res = await fetch("https://gionnygiannygio.github.io/100-ottani-gallery/home-gallery.json");
            const data = await res.json();

            grid.innerHTML = "";

            data.slice(0,10).forEach((item,i)=>{
                const card = document.createElement('article');
                card.className = `jdm-ss-card ${pattern[i]}`;

                card.innerHTML = `
                    <a href="${item.url}" target="_blank" style="display:block;height:100%;">
                        <div class="jdm-ss-media">
                            <img src="${item.img}" loading="lazy">
                        </div>
                    </a>
                `;

                grid.appendChild(card);
            });

        }catch(e){
            console.error(e);
            grid.innerHTML = "Errore caricamento";
        }
    }

    loadHomeGallery();

})();
