export class TabLink {
    constructor(container, tabs) {
        this.container = container;
        this.tabs = tabs;
        this.activeTab = 0;
        this.buttons = [];
        this.contentContainer = null;
        this.render();
        this.addEventListeners();
    }

    render() {
        // Create tab buttons
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        tabButtons.style.cssText = 'margin-bottom: 2rem; display: flex; gap: 1rem;';

        this.tabs.forEach((tab, index) => {
            const button = document.createElement('button');
            button.textContent = tab.label;
            button.dataset.tab = index;
            button.style.cssText = `
                padding: 0.5rem 1rem;
                border: 1px solid var(--color-text);
                background: ${index === this.activeTab ? 'var(--color-text)' : 'none'};
                color: ${index === this.activeTab ? 'var(--color-bg)' : 'var(--color-text)'};
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            `;
            this.buttons.push(button);
            tabButtons.appendChild(button);
        });

        // Create content container if it doesn't exist
        if (!this.contentContainer) {
            this.contentContainer = document.createElement('div');
            this.contentContainer.className = 'tab-content';
        }
        
        // Update content
        this.contentContainer.innerHTML = this.tabs[this.activeTab].content;

        // Clear and append new content only if necessary
        if (!this.container.contains(tabButtons)) {
            this.container.innerHTML = '';
            this.container.appendChild(tabButtons);
            this.container.appendChild(this.contentContainer);
        }
    }

    addEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = parseInt(button.dataset.tab);
                if (tabIndex !== this.activeTab) {
                    this.setActiveTab(tabIndex);
                }
            });
        });
    }

    setActiveTab(index) {
        // Update buttons styles
        this.buttons.forEach((button, i) => {
            button.style.background = i === index ? 'var(--color-text)' : 'none';
            button.style.color = i === index ? 'var(--color-bg)' : 'var(--color-text)';
        });

        // Update content
        this.activeTab = index;
        this.contentContainer.innerHTML = this.tabs[this.activeTab].content;
    }
}
