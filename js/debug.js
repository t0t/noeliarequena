// Debug utilities
const DEBUG = {
    init() {
        this.addGridOverlay();
        this.addConsoleStyles();
        this.initKeyboardShortcuts();
        console.log('%c🔍 Debug tools initialized', 'color: #4CAF50; font-weight: bold;');
    },

    addGridOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'debug-grid-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            background: linear-gradient(90deg, 
                rgba(255,0,0,0.1) 1px, 
                transparent 1px
            ),
            linear-gradient(rgba(255,0,0,0.1) 1px, 
                transparent 1px
            );
            background-size: 20px 20px;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
    },

    addConsoleStyles() {
        // Estilos personalizados para console.log
        console.debug = (...args) => {
            console.log('%c[DEBUG]', 'color: #2196F3; font-weight: bold;', ...args);
        };
        console.info = (...args) => {
            console.log('%c[INFO]', 'color: #4CAF50; font-weight: bold;', ...args);
        };
        console.warn = (...args) => {
            console.log('%c[WARN]', 'color: #FFC107; font-weight: bold;', ...args);
        };
        console.error = (...args) => {
            console.log('%c[ERROR]', 'color: #F44336; font-weight: bold;', ...args);
        };
    },

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + G: Toggle grid overlay
            if (e.altKey && e.key === 'g') {
                const overlay = document.getElementById('debug-grid-overlay');
                overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
                console.debug('Grid overlay toggled');
            }

            // Alt + D: Log DOM structure
            if (e.altKey && e.key === 'd') {
                this.logDOMStructure();
            }

            // Alt + S: Log current styles
            if (e.altKey && e.key === 's') {
                this.logElementStyles();
            }
        });
    },

    logDOMStructure(element = document.body, level = 0) {
        const indent = ' '.repeat(level * 2);
        const children = element.children;
        console.group('%cDOM Structure', 'color: #9C27B0; font-weight: bold;');
        
        for (let child of children) {
            const classes = child.className ? `.${child.className.split(' ').join('.')}` : '';
            const id = child.id ? `#${child.id}` : '';
            console.log(`${indent}${child.tagName.toLowerCase()}${id}${classes}`);
            this.logDOMStructure(child, level + 1);
        }
        
        console.groupEnd();
    },

    logElementStyles() {
        const element = document.querySelector(':hover');
        if (!element) {
            console.warn('No element hovered');
            return;
        }

        const styles = window.getComputedStyle(element);
        console.group(`%cStyles for ${element.tagName.toLowerCase()}`, 'color: #FF9800; font-weight: bold;');
        
        const relevantStyles = [
            'width', 'height',
            'margin', 'padding',
            'position', 'display',
            'color', 'background-color',
            'font-size', 'font-family'
        ];

        relevantStyles.forEach(prop => {
            console.log(`${prop}: ${styles.getPropertyValue(prop)}`);
        });
        
        console.groupEnd();
    },

    measurePerformance(label) {
        console.time(label);
        return {
            end: () => console.timeEnd(label)
        };
    }
};

// Auto-inicializar en modo desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => DEBUG.init());
}
