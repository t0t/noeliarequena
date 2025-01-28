import { BaseView } from './BaseView.js';
import styles from '../css/modules/exposiciones.module.css';

export class Exposiciones extends BaseView {
    async init() {
        await super.init();
        this.setTitle('Exposiciones');
        
        this.container.innerHTML = `
            <section class="${styles.exposiciones}">
                <div class="container">
                    <div class="grid gap-4">
                        <div class="col-span-12">
                            <h1>Exposiciones</h1>
                        </div>
                    </div>

                    <div class="${styles.expoBlock}">
                        <div class="grid gap-8 items-center">
                            <div class="col-span-12 md:col-span-6">
                                <div class="${styles.content}">
                                    <h2>Título Exposición 1</h2>
                                    <p class="${styles.date}">15 Enero - 28 Febrero 2024</p>
                                    <p class="${styles.description}">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                                        nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <div class="${styles.mediaContainer}">
                                    <img 
                                        src="/expo/expo1.jpg" 
                                        alt="Exposición 1" 
                                        class="${styles.image}"
                                        loading="lazy"
                                    />
                                </div>
                                <div class="${styles.mediaContainer}">
                                    <video 
                                        class="${styles.video}" 
                                        controls 
                                        preload="none"
                                        poster="/expo/video1-poster.jpg"
                                    >
                                        <source src="/expo/video1.mp4" type="video/mp4">
                                        Tu navegador no soporta el elemento video.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="${styles.expoBlock}">
                        <div class="grid gap-8 items-center">
                            <div class="col-span-12 md:col-span-6 md:order-2">
                                <div class="${styles.content}">
                                    <h2>Título Exposición 2</h2>
                                    <p class="${styles.date}">1 Marzo - 15 Abril 2024</p>
                                    <p class="${styles.description}">
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse 
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                                        cupidatat non proident, sunt in culpa qui officia deserunt mollit 
                                        anim id est laborum.
                                    </p>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-6 md:order-1">
                                <div class="${styles.mediaContainer}">
                                    <img 
                                        src="/expo/expo2.jpg" 
                                        alt="Exposición 2" 
                                        class="${styles.image}"
                                        loading="lazy"
                                    />
                                </div>
                                <div class="${styles.mediaContainer}">
                                    <video 
                                        class="${styles.video}" 
                                        controls 
                                        preload="none"
                                        poster="/expo/video2-poster.jpg"
                                    >
                                        <source src="/expo/video2.mp4" type="video/mp4">
                                        Tu navegador no soporta el elemento video.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        return this;
    }
}
