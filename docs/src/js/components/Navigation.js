import styles from '../../css/modules/navigation.module.css';

export class Navigation {
    constructor(container) {
        this.container = container;
        if (!this.container) {
            throw new Error('Navigation container not found');
        }
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <nav id="navbar" class="${styles.menu}">
                <a href="/exposiciones" data-link>expo</a>
                <a href="/artworks" data-link>artworks</a>
                <a href="/bio" data-link>bio</a>
            </nav>
        `;

        // Marcar el enlace activo
        this.updateActiveLink();
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.container.querySelectorAll('a[data-link]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath === href || 
                (href !== '/' && currentPath.startsWith(href))) {
                link.classList.add(styles.active);
            } else {
                link.classList.remove(styles.active);
            }
        });
    }

    addEventListeners() {
        let lastScroll = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            const currentScroll = window.scrollY;
            const isScrollingDown = currentScroll > lastScroll;

            if (isScrollingDown) {
                navbar.classList.add(styles.hidden);
            } else {
                navbar.classList.remove(styles.hidden);
            }

            lastScroll = currentScroll;
        });

        // Actualizar el enlace activo cuando cambia la ruta
        window.addEventListener('popstate', () => this.updateActiveLink());
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-link]')) {
                setTimeout(() => this.updateActiveLink(), 0);
            }
        });
    }
}
