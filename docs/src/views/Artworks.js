import { BaseView } from './BaseView.js';
import styles from '../css/modules/artworks.module.css';
import { ImageLoader } from '../js/modules/ImageLoader.js';
import { GalleryStore } from '../js/store/gallery.js';

export class Artworks extends BaseView {
    constructor(container) {
        super(container);
        this.artworks = [
            {
                src: '/images/obras/img1.jpg',
                title: 'Obra 1',
                description: 'Descripción de la obra.',
                width: 800,
                height: 1200
            },
            {
                src: '/images/obras/img2.jpg',
                title: 'Obra 2',
                description: 'Descripción de la obra.',
                width: 1200,
                height: 800
            },
            {
                src: '/images/obras/img3.jpg',
                title: 'Obra 3',
                description: 'Descripción de la obra.',
                width: 800,
                height: 1200
            },
            {
                src: '/images/obras/img4.jpg',
                title: 'Obra 4',
                description: 'Descripción de la obra.',
                width: 1200,
                height: 800
            },
            {
                src: '/images/obras/img5.jpg',
                title: 'Obra 5',
                description: 'Descripción de la obra.',
                width: 800,
                height: 1200
            },
            {
                src: '/images/obras/img6.jpg',
                title: 'Obra 6',
                description: 'Descripción de la obra.',
                width: 1200,
                height: 800
            }
        ];
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
                        <div class="col-span-12">
                            <h1>Obras</h1>
                        </div>
                    </div>
                </div>
                <div class="${styles.masonryGrid}">
                    ${this.generateArtworksHTML()}
                </div>
            </section>
        `;

        // Inicializar el store de la galería
        this.galleryStore.setItems(this.artworks);

        // Configurar eventos
        this.setupGalleryEvents();
        window.addEventListener('resize', this._boundResizeHandler);

        // Cargar y redimensionar imágenes
        try {
            await this.loadAndResizeImages();
        } catch (error) {
            console.warn('Error loading images:', error);
        }

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
                    <div class="${styles.info}">
                        <h2>${artwork.title}</h2>
                        <p>${artwork.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadAndResizeImages() {
        const items = this.container.querySelectorAll(`.${styles.artwork}`);
        
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
        this.setupResizeObserver();
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
            artwork.addEventListener('click', () => {
                const index = parseInt(artwork.dataset.index);
                this.galleryStore.open(index);
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
