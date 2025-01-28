import { BaseView } from './BaseView.js';
import styles from '../css/modules/bio.module.css';

export class Bio extends BaseView {
    constructor(container) {
        super(container);
    }

    async init() {
        await super.init();
        this.setTitle('Bio');
        
        this.container.innerHTML = `
            <section class="${styles.bio} container">
                <div class="grid gap-8">
                    <div class="col-span-12 md:col-span-6">
                        <div class="${styles.avatarContainer}">
                            <img 
                                src="/images/avatar.jpg" 
                                alt="Noelia Requena" 
                                class="${styles.avatar}"
                                loading="lazy"
                                onload="this.classList.add('${styles.loaded}')"
                            />
                        </div>
                    </div>
                    
                    <div class="col-span-12 md:col-span-6">
                        <h1>Bio</h1>
                        <div class="${styles.bioContent}">
                            <p>
                                Soy una artista plástica que busca expresar la complejidad de las emociones humanas 
                                a través del arte. Mi trabajo se centra en explorar la relación entre el cuerpo, 
                                la identidad y la experiencia vivida.
                            </p>
                            
                            <h2>Educación</h2>
                            <ul>
                                <li>2020 - Máster en Artes Visuales</li>
                                <li>2018 - Licenciatura en Bellas Artes</li>
                            </ul>
                            
                            <h2>Exposiciones Destacadas</h2>
                            <ul>
                                <li>2024 - "Título de la Exposición", Galería XYZ</li>
                                <li>2023 - "Título de la Exposición", Museo ABC</li>
                            </ul>
                            
                            <h2>Premios y Reconocimientos</h2>
                            <ul>
                                <li>2023 - Premio Nacional de Arte Contemporáneo</li>
                                <li>2022 - Beca de Investigación Artística</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        `;

        return this;
    }

    destroy() {
        super.destroy();
    }
}
