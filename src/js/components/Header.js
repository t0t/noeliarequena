import styles from '../../css/modules/header.module.css';

export class Header {
    constructor(container) {
        this.container = container;
        if (!this.container) {
            throw new Error('Header container not found');
        }
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <header class="${styles.header}">
                <a href="/" class="${styles.logo}" data-link>
                    <img src="/images/logo.svg" alt="Noelia Requena" />
                </a>
            </header>
        `;
    }

    addEventListeners() {
        // Asegurar que el logo siempre sea clicable
        const logo = this.container.querySelector(`.${styles.logo}`);
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                const router = window.router || (window.app && window.app.router);
                if (router) {
                    router.navigate('/', false);
                } else {
                    window.location.href = '/';
                }
            });
        }
    }

    destroy() {
        // Limpiar event listeners
        const logo = this.container.querySelector(`.${styles.logo}`);
        if (logo) {
            logo.removeEventListener('click', () => {});
        }
    }
}
