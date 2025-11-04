import { db } from '../js/config/firebaseConfig.js';
        import { ref as refS, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

        const catalog = document.getElementById('catalog');
        const emptyMsg = document.getElementById('empty');
        const searchInput = document.getElementById('searchInput');

        let autos = []; // array local de automoviles
        const BRANDS = ['TOYOTA', 'NISSAN', 'FORD'];

        function createBrandSection(title) {
            const section = document.createElement('section');
            section.className = 'brand-section';
            section.dataset.brand = title;
            section.innerHTML = `
                <div class="brand-title">
                    <h2>${title}</h2>
                    <div class="brand-sub" id="count-${title}"></div>
                </div>
                <div class="grid" id="grid-${title}"></div>
            `;
            return section;
        }

        function renderSections(list) {
            catalog.innerHTML = '';

            if (!list || list.length === 0) {
                emptyMsg.style.display = 'block';
                return;
            }
            emptyMsg.style.display = 'none';

            // Crear secciones para cada marca importante y otra para OTROS
            const sections = {};
            BRANDS.forEach(b => {
                const sec = createBrandSection(b);
                catalog.appendChild(sec);
                sections[b] = sec.querySelector('.grid');
            });

            // OTROS
            const otrosSec = createBrandSection('OTROS');
            catalog.appendChild(otrosSec);
            sections['OTROS'] = otrosSec.querySelector('.grid');

            // Rellenar
            const counts = {};
            Object.keys(sections).forEach(k => counts[k] = 0);

            list.forEach(item => {
                const marcaUp = (item.marca || '').toString().toUpperCase();
                const target = BRANDS.includes(marcaUp) ? marcaUp : 'OTROS';
                counts[target]++;

                const grid = sections[target];
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${item.urlImag || 'https://via.placeholder.com/400x300?text=Sin+imagen'}" alt="${item.marca || ''} ${item.modelo || ''}">
                    <div class="body">
                        <div class="marca">${item.marca || ''} <span style="font-weight:600; color:#444; font-size:0.9rem;">(Serie ${item.numSerie || ''})</span></div>
                        <div class="modelo">${item.modelo || ''}</div>
                        <div class="descripcion">${item.descripcion || ''}</div>
                    </div>
                    <div class="footer">
                        <div class="precio-falso">Consultar</div>
                        <button class="ver-detalle" data-serie="${item.numSerie || ''}">Ver detalle</button>
                    </div>
                `;
                card.querySelector('.ver-detalle').addEventListener('click', (e) => {
                    const serie = e.currentTarget.dataset.serie;
                    alert('Ver detalle del automóvil: ' + serie);
                });
                grid.appendChild(card);
            });

            // Actualizar contadores (y ocultar secciones vacías)
            Object.keys(sections).forEach(k => {
                const countEl = document.getElementById('count-' + k);
                countEl.textContent = counts[k] > 0 ? `${counts[k]} vehículo(s)` : '';
                const sec = catalog.querySelector(`[data-brand="${k}"]`);
                if (counts[k] === 0) sec.style.display = 'none';
            });
        }

        function applyFilters() {
            const q = searchInput.value.trim().toLowerCase();
            const filtered = autos.filter(a => {
                return q === '' || (
                    (a.marca && a.marca.toLowerCase().includes(q)) ||
                    (a.modelo && a.modelo.toLowerCase().includes(q)) ||
                    (a.numSerie && String(a.numSerie).toLowerCase().includes(q))
                );
            });
            renderSections(filtered);
        }

        // Escuchar cambios en Firebase (colección Automoviles)
        const dbRef = refS(db, 'Automoviles');
        onValue(dbRef, (snapshot) => {
            const list = [];
            snapshot.forEach(child => {
                const data = child.val();
                data.numSerie = data.numSerie || child.key;
                list.push(data);
            });
            autos = list;
            applyFilters();
        });

        // filtros UI
        searchInput.addEventListener('input', () => applyFilters());