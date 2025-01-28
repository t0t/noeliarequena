import { BaseView } from './BaseView.js';
import styles from '../css/modules/home.module.css';
import Animator from '../js/modules/Animator.js';

export class Home extends BaseView {
    constructor(container) {
        super(container);
        this._cleanupFunctions = [];
    }

    async render() {
        this.setTitle('Home');
        this.container.innerHTML = `
            <section class="${styles.cover} container-fluid parallax">
                <div class="parallax-bg" style="background-image: url('/images/bg1.jpg')"></div>
                <div class="grid gap-4">
                    <div class="col-span-12 text-center">
                        <h1 class="typewriter">Noelia Requena</h1>
                        <svg id="scrollDownBtn" class="hover-lift" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                        </svg>
                    </div>
                </div>
            </section>
            
            <section class="${styles.about} container">
                <div class="grid gap-4">
                    <div class="col-span-12 md:col-span-6">
                        <h2>About Me</h2>
                        <p>I am a visual artist based in Spain...</p>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <img src="/images/avatar.jpg" alt="Noelia Requena" class="img-hover-zoom">
                    </div>
                </div>
            </section>
            
            <section class="${styles.featured} container">
                <h2>Featured Works</h2>
                <div class="grid gap-4">
                    <div class="col-span-12 md:col-span-4">
                        <div class="img-hover-zoom">
                            <img src="/images/obras/img1.jpg" alt="Obra 1">
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <div class="img-hover-zoom">
                            <img src="/images/obras/img2.jpg" alt="Obra 2">
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <div class="img-hover-zoom">
                            <img src="/images/obras/img3.jpg" alt="Obra 3">
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Initialize animations
        this.initializeAnimations();
    }

    async afterRender() {
        // Initialize animations
        this.initializeAnimations();
    }

    initializeAnimations() {
        // Parallax effect for cover image
        const parallaxBg = this.container.querySelector('.parallax-bg');
        if (parallaxBg) {
            const cleanup = Animator.parallax(parallaxBg, window, {
                speed: 0.5,
                direction: 'vertical',
                min: -50,
                max: 50
            });
            this._cleanupFunctions.push(cleanup);
        }

        // Scroll animations
        const sections = this.container.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-enter', 'visible');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            section.classList.add('fade-enter');
            observer.observe(section);
        });

        this._cleanupFunctions.push(() => {
            observer.disconnect();
        });

        // Scroll down button animation
        const scrollDownBtn = this.container.querySelector('#scrollDownBtn');
        if (scrollDownBtn) {
            const handleClick = () => {
                const aboutSection = this.container.querySelector(`.${styles.about}`);
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            };
            
            scrollDownBtn.addEventListener('click', handleClick);
            this._cleanupFunctions.push(() => {
                scrollDownBtn.removeEventListener('click', handleClick);
            });
        }
    }

    destroy() {
        // Clean up all animations and observers
        this._cleanupFunctions.forEach(cleanup => cleanup());
        this._cleanupFunctions = [];
        
        super.destroy();
    }
}
