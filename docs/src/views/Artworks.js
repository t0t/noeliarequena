import { BaseView } from './BaseView.js';
import styles from '../css/modules/artworks.module.css';
import { ImageLoader } from '../js/modules/ImageLoader.js';
import { GalleryStore } from '../js/store/gallery.js';

export class Artworks extends BaseView {
    constructor(container) {
        super(container);
        this.artworks = Array.from({ length: 41 }, (_, i) => ({
            src: `/images/obras/img${i + 1}.jpg`,
            title: `Obra ${i + 1}`,
            description: 'Descripción de la obra.',
            // Alternamos entre dimensiones verticales y horizontales
            width: (i % 2 === 0) ? 800 : 1200,
            height: (i % 2 === 0) ? 1200 : 800
        }));
        this.galleryStore = new GalleryStore();
        this.resizeObserver = null;
        this._boundResizeHandler = this.handleResize.bind(this);
    }

    async init() {
        await super.init();
        this.setTitle('Artworks');
        
        this.container.innerHTML = `
            <section class="${styles.artworks}">
                <div class="container">
                    <div class="grid gap-4">
                    </div>
                </div>
                <div class="${styles.masonryGrid}">
                    ${this.generateArtworksHTML()}
                </div>
                <div class="${styles.review} container">
                    <div class="${styles.tabs}">
                        <button class="${styles.tablink} ${styles.active}" data-lang="en">EN</button>
                        <button class="${styles.tablink}" data-lang="es">ES</button>
                    </div>
                    
                    <div id="en" class="${styles.tabcontent} ${styles.active}">
                        <h3>Review</h3>
                        <p>"A body in space. A tremor in time. A process of light and shade. Once revealed, the body disintegrates and is deconstructed. A spontaneous crystallisation of dynamic contrasts. A chiaroscuro of fragility and power, cold and heat. The body is a temple of tensions; hermetic, open and shut at the same time, existing only in the logic of membranes. Light that passes through, reflected like the nervous shade of something more. The ornament of the oils captures it like an insect in amber. Frozen but at the same time fluttering. An encrypted longing, like a puzzle in multiple dimensions. The precise and graceful line (a calligraphy of mysteries), unravelling the inexhaustible mystery of beauty. Ariadne's thread entangling. A dark profession. The beauty of horror and the horror of beauty. We need the contrast. The balance in the contradiction. Always the light and the shade, the chiaroscuro...</p>

                        <p>As in the Japanese technique, kintsugi, the lacquer repairs the cracks in the broken ceramic, which is the body. There is a beauty in the crack, like a latent sign of its interior life: vortex of a wound made manifest on the outside. Cloth covers the shape like a gauze a mould. Skin as impasto. Life as a continuous moment of uncertainty. Are we free or are we confined within the coordinates of chance? This is the mystery of a body in a room, a body inhabiting a space, of a body being space. Existence is naked like a question in the void, spilling over the morning air, reflected in the light coming through the window. In this frame, in this space we celebrate the mystery of life."</p>
                        <p class="${styles.author}">— Román Bayarri</p>
                    </div>
                    
                    <div id="es" class="${styles.tabcontent}">
                        <h3>Reseña</h3>
                        <p>"Un cuerpo en el espacio. Un temblor en el tiempo. Un proceso de luz y sombra. Una vez revelado, el cuerpo se desintegra y se deconstruye. Una cristalización espontánea de contrastes dinámicos. Un claroscuro de fragilidad y poder, frío y calor. El cuerpo es un templo de tensiones; hermético, abierto y cerrado al mismo tiempo, existiendo solo en la lógica de las membranas. Luz que atraviesa, reflejada como la sombra nerviosa de algo más. El ornamento de los óleos lo captura como un insecto en ámbar. Congelado pero al mismo tiempo revoloteando. Un anhelo encriptado, como un rompecabezas en múltiples dimensiones. La línea precisa y grácil (una caligrafía de misterios), desentrañando el misterio inagotable de la belleza. El hilo de Ariadna enredándose. Una profesión oscura. La belleza del horror y el horror de la belleza. Necesitamos el contraste. El equilibrio en la contradicción. Siempre la luz y la sombra, el claroscuro...</p>
                        <p>Como en la técnica japonesa, kintsugi, la laca repara las grietas en la cerámica rota, que es el cuerpo. Hay una belleza en la grieta, como un signo latente de su vida interior: vórtice de una herida que se manifiesta en el exterior. La tela cubre la forma como una gasa un molde. La piel como empaste. La vida como un momento continuo de incertidumbre. ¿Somos libres o estamos confinados dentro de las coordenadas del azar? Este es el misterio de un cuerpo en una habitación, un cuerpo habitando un espacio, de un cuerpo siendo espacio. La existencia está desnuda como una pregunta en el vacío, derramándose sobre el aire de la mañana, reflejada en la luz que entra por la ventana. En este marco, en este espacio celebramos el misterio de la vida."</p>
                        <p class="${styles.author}">— Román Bayarri</p>
                    </div>
                </div>
            </section>
        `;

        // Inicializar el store de la galería
        this.galleryStore.setItems(this.artworks);

        // Configurar eventos
        this.setupGalleryEvents();
        window.addEventListener('resize', this._boundResizeHandler);

        // Asegurarnos de que las imágenes se cargan y el masonry se inicializa
        requestAnimationFrame(async () => {
            try {
                await this.loadAndResizeImages();
                // Forzar un reflow para asegurar que el masonry se calcula correctamente
                this.handleResize();
            } catch (error) {
                console.warn('Error loading images:', error);
            }
        });

        return this;
    }

    handleResize() {
        if (this.resizeObserver) {
            const items = this.container.querySelectorAll(`.${styles.artwork}`);
            items.forEach(item => this.resizeGridItem(item));
        }
    }

    generateArtworksHTML() {
        return this.artworks.map((artwork, index) => {
            const aspectRatio = (artwork.height / artwork.width) * 100;
            
            return `
                <div class="${styles.artwork}" data-index="${index}">
                    <div class="${styles.aspectRatioBox}" style="padding-bottom: ${aspectRatio}%">
                        <img 
                            class="${styles.artworkImage}"
                            src="${artwork.src}"
                            alt="${artwork.title}"
                            loading="lazy"
                            width="${artwork.width}"
                            height="${artwork.height}"
                        />
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadAndResizeImages() {
        const items = this.container.querySelectorAll(`.${styles.artwork}`);
        
        // Primero configuramos el ResizeObserver
        this.setupResizeObserver();
        
        const imageLoadPromises = Array.from(items).map(item => {
            return new Promise((resolve) => {
                const img = item.querySelector('img');
                if (img.complete) {
                    this.resizeGridItem(item);
                    resolve();
                } else {
                    img.onload = () => {
                        this.resizeGridItem(item);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error('Error loading image:', img.src);
                        resolve();
                    };
                }
            });
        });

        await Promise.all(imageLoadPromises);
    }

    resizeGridItem(item) {
        if (!item || !this.container) return;

        const grid = this.container.querySelector(`.${styles.masonryGrid}`);
        if (!grid) return;

        const rowHeight = parseInt(window.getComputedStyle(grid).gridAutoRows) || 10;
        const rowGap = parseInt(window.getComputedStyle(grid).rowGap) || 16;
        
        const aspectRatioBox = item.querySelector(`.${styles.aspectRatioBox}`);
        if (!aspectRatioBox) return;

        const contentHeight = aspectRatioBox.getBoundingClientRect().height;
        const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
        
        item.style.setProperty('--span', rowSpan);
    }

    setupResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const item = entry.target;
                this.resizeGridItem(item);
            });
        });

        const items = this.container.querySelectorAll(`.${styles.artwork}`);
        items.forEach(item => {
            this.resizeObserver.observe(item);
        });
    }

    setupGalleryEvents() {
        const artworks = this.container.querySelectorAll(`.${styles.artwork}`);
        artworks.forEach(artwork => {
            artwork.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(artwork.dataset.index);
                if (!isNaN(index)) {
                    this.galleryStore.open(index);
                }
            });
        });

        // Setup language tabs
        const tabs = this.container.querySelectorAll(`.${styles.tablink}`);
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove(styles.active));
                tab.classList.add(styles.active);
                
                // Update active content
                const contents = this.container.querySelectorAll(`.${styles.tabcontent}`);
                contents.forEach(content => {
                    if (content.id === lang) {
                        content.classList.add(styles.active);
                    } else {
                        content.classList.remove(styles.active);
                    }
                });
            });
        });
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        window.removeEventListener('resize', this._boundResizeHandler);

        const artworks = this.container.querySelectorAll(`.${styles.artwork}`);
        artworks.forEach(artwork => {
            artwork.removeEventListener('click', () => {});
        });
        
        super.destroy();
    }
}
