import { BaseView } from './BaseView.js';
import styles from '../css/modules/exposiciones.module.css';

export class Exposiciones extends BaseView {
    async init() {
        await super.init();
        this.setTitle('Exposiciones');
        
        this.container.innerHTML = `
            <section class="${styles.exposiciones}">
                <div class="${styles.grid} ${styles['grid-cols-12']} ${styles['gap-8']}">
                    <div class="${styles['col-span-4']}">
                        <div class="${styles.mediaContainer}">
                            <img 
                                src="/images/expos/cartel_v1.jpeg" 
                                alt="Cartel de la exposición" 
                                class="${styles.image}"
                                loading="lazy"
                            />
                        </div>
                        <div class="${styles.mediaContainer}">
                            <video 
                                class="${styles.video}" 
                                controls 
                                preload="none"
                                playsinline
                                poster="/images/expos/video_expo_6_poster.jpg"
                            >
                                <source src="/images/expos/video_expo_6.webm" type="video/webm">
                                <source src="/images/expos/video_expo_6.mp4" type="video/mp4">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                       
                    </div>
                    <div class="${styles['col-span-8']}">
                        <div class="${styles.content}">
                            <h2>Can Puget</h2>
                            <p class="${styles.date}">Sala de exposiciones Manlleu, 2023</p>
                            <p class="${styles.subtitle}"><strong>Ciertos procesos emocionales coagulan en forma de cuadros</strong></p>
                            <div class="${styles.description}">
                                <p>Pinto desnudos como una forma de expresión posible que, lejos de alegorías y connotaciones reivindicativas, son en mí una tentativa de despojar de capas al cuerpo para acceder hacia mi verdad encarnada. Una desnudez que escoge la piel y la carne, que descarta arquetipos y capas teorizadas.</p>
                                
                                <p>Busco reconocerme, descubrirme en el anonimato de distintos cuerpos, siendo ése el lugar donde no hay ausencia y donde lamo mis propias heridas irracionales, donde despojo a mi realidad de sus vestiduras.</p>
                                
                                <p>Me apetece significar una piel cristalina, translúcida, frágil: como una vasija cubriendo la superficie del cuadro donde me puedo hacer invisible, y entrar o salir a voluntad.</p>
                                
                                <p>En los matices del proceso pictórico se van superponiendo las instantáneas de cómo me sentí en ahoras ya transitados.</p>
                                
                                <p>Me inundo en sensaciones mientras bajo a mi mundo emocional por medio de la materia, percepciones que una vez plasmadas parece que desaparecen o tal vez quedan escondidas como un misterio esperando a ser desvelado. Me dejo sorprender por mi propia necesidad irracional de fijar sombras sutiles, de remarcar cómo se proyecta la luz y se reafirman contornos; vinculándome a la sorpresa del propio descubrimiento.</p>
                                
                                <p>En ocasiones al aplicar una determinada vibración de color, conecto con una sensación de éxtasis, como una pulsión de fundirme en una vibración divina. La luz iluminando partes del cuerpo descubre con capas muy delgadas y traslúcidas el camino que siento hacia lo sublime. Las corrientes delicadas de las luces y sus tonos se imprimen, de algún modo, también en mi cuerpo y en mi mente.</p>
                                
                                <p>Los procesos pictóricos son un espejo, generando un espacio donde mis carencias y miedos se van viendo revelados tímidamente, donde danzan mis dualidades internas. Espacio donde es posible un encuentro conmigo misma, un encuentro en el que mi hacer caótico y desbordado busca contener(se) de todo lo que va quedando fijado.</p>
                            </div>
                             <div class="${styles.mediaContainer}">
                            <video 
                                class="${styles.video}" 
                                controls 
                                preload="none"
                                playsinline
                                poster="/images/expos/video_expo_5_poster.jpg"
                            >
                                <source src="/images/expos/video_expo_5.webm" type="video/webm">
                                <source src="/images/expos/video_expo_5.mp4" type="video/mp4">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                        </div>
                        </div>
                </div>

                <div class="${styles.grid} ${styles['grid-cols-12']} ${styles['gap-8']} mt-8">
                    <div class="${styles['col-span-4']}">
                        <div class="${styles.mediaContainer}">
                            <video 
                                class="${styles.video}" 
                                controls 
                                preload="none"
                                playsinline
                                poster="/images/expos/video_expo_7_poster.jpg"
                            >
                                <source src="/images/expos/video_expo_7.webm" type="video/webm">
                                <source src="/images/expos/video_expo_7.mp4" type="video/mp4">
                                Tu navegador no soporta el elemento video.
                            </video>
                        </div>
                    </div>
                    <div class="${styles['col-span-8']}">
                        <div class="${styles.content}">
                            <h2>Exposición colectiva</h2>
                            <p class="${styles.date}">Muestra de arte contemporáneo MGA, 2024</p>
                            <div class="${styles.description}">
                                <p class="${styles.subtitle}">Autocensura<br>
                                óleo sobre lienzo, 130x89cm</p>
                                
                                <p>Oculto, reprimo, me callo.<br>
                                Experimentando un deterioro<br>
                                y una deformación.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        return this;
    }
}
