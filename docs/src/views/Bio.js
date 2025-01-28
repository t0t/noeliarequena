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
                        <div class="${styles.bioContent}">
                            <blockquote class="emphasis">
                                "When one becomes aware of the mystery of existence and does not understand it, but out of sheer sincerity and inner coherence, she needs answers even to the pain, then one finds her golden and wonderful Ariadna's thread"
                            </blockquote>
                            <p class="${styles.quoteAuthor}">
                                — Blas Cubells
                            </p>
                            
                            <dl>
                                <dt>Born in Vic (Barcelona) in 1976.</dt>
                                <dt>1985-1991</dt>
                                <dd>
                                    During my childhood I trained at the
                                    <i>Escola de dibuix i art Masferrer</i> in Vic with the teachers
                                    Pere Isern Puntí, Eduard Xandri Calvet, Lluís Bres Oliva, Lluís Gros
                                    Pujol...
                                </dd>
                    
                                <dt>1994-1995</dt>
                                <dd>
                                    Studied at the
                                    <i>Escola d'arts aplicades i oficis artístics</i> (School of Applied
                                    Arts and Crafts) in Vic.
                                </dd>
                                <dt>1997-2001</dt>
                                <dd>
                                    Degree in Fashion Design from the
                                    <i>Escola Superior de Disseny Bau</i> in Barcelona.
                                </dd>
                                <dt>2000-2001</dt>
                                    <dd>Millinery workshop in Barcelona with <i>Nina Pawloswsky</i>.</dd>
                                <dt>1999-2004</dt>
                                <dd>
                                Began working with the women’s fashion brand
                                <i>Giménez&amp;Zuazo</i> and its other brand <i>Boba by G&amp;Z</i>,
                                with distribution nationally and internationally through 250
                                multi-brands channels in Spain, France, Italy, Japan and others.
                                </dd>
                    
                                <dd>
                                    Under the leadership of the partners, co-managed the design
                                    department. I was responsible for the entire design process and the
                                    illustrations, developing the collections, researching the latest
                                    looks and trends, design, drafting and supervising the technical
                                    specifications, coordination with the patterns team, managing
                                    accessories and materials, coordination with fabric printing and production companies.
                                </dd>
                                <dt>2004-2010</dt>
                                <dd>
                                    Creative director and founding partner of the women’s fashion brand
                                    Obvia. Development of the business idea, part of the management
                                    team, co-director of the design department, director of production,
                                    director of sales. National distribution to multi-brand points of
                                    sale in Spain. Local production.
                                </dd>
                                <dt>2010-2018</dt>
                                <dd>
                                    Freelance Textile Graphic Designer. Designer of prints for women, men and children’s clothing&nbsp;for
                                    <i>Padma Diseño S.L., Zara, Pull&amp;Bear, Bershka, Mango, Replay, Springfield, Blue Inc., Studio F Women / STF Group Colombia</i>...
                                </dd>
                    
                                <dt>2019</dt>
                                <dd>
                                Left the world of fashion and illustration to begin looking for a
                                more intimate mode of expression.
                                </dd>
                                <dd>
                                In parallel with my professional career, I maintained a constant
                                level of training in the art world, with incursions into a variety
                                of techniques such as lacquer, ceramics, sculpture, oils, art for
                                children, artist books, as well as astrology and active learning.
                                </dd>
                                <dd>
                                Currently, I live with my partner, the multidisciplinary artist
                                Sergio Forés. Mother to two children and searching for alternative
                                ways of life and education. In 2014 I moved to a small village in
                                Alt Penedès surrounded by vineyards and nature.
                                </dd>
                            </dl>
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
