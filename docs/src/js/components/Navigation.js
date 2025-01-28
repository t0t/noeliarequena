import styles from '../../css/modules/navigation.module.css';

export class Navigation {
    constructor(container) {
        this.container = container;
        if (!this.container) {
            throw new Error('Navigation container not found');
        }
        this.isMenuOpen = false;
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <nav id="navbar" class="${styles.menu}">
                <button class="${styles.hamburger}">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="${styles.menuItems}">
                    <a href="/exposiciones" data-link>expo</a>
                    <a href="/artworks" data-link>artworks</a>
                    <a href="/bio" data-link>bio</a>
                </div>
            </nav>
        `;

        // Marcar el enlace activo
        this.updateActiveLink();
    }

    addEventListeners() {
        // Toggle menú en móvil
        const hamburger = this.container.querySelector(`.${styles.hamburger}`);
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                this.isMenuOpen = !this.isMenuOpen;
                hamburger.classList.toggle(styles.active);
                this.container.querySelector(`.${styles.menuItems}`).classList.toggle(styles.active);
            });
        }

        // Cerrar menú al hacer click en un enlace
        const menuItems = this.container.querySelectorAll(`.${styles.menuItems} a`);
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.isMenuOpen = false;
                    hamburger.classList.remove(styles.active);
                    this.container.querySelector(`.${styles.menuItems}`).classList.remove(styles.active);
                }
            });
        });

        // Cerrar menú al hacer scroll
        let lastScroll = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const navbar = document.getElementById('navbar');
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.classList.add(styles.hidden);
                if (this.isMenuOpen) {
                    this.isMenuOpen = false;
                    hamburger.classList.remove(styles.active);
                    this.container.querySelector(`.${styles.menuItems}`).classList.remove(styles.active);
                }
            } else {
                // Scrolling up
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

    updateActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.container.querySelectorAll('a');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add(styles.active);
            } else {
                link.classList.remove(styles.active);
            }
        });
    }
}
