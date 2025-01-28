export class TabLink {
    constructor(container, tabs) {
        this.container = container;
        this.tabs = tabs;
        this.activeTab = 0;
        this.render();
        this.addEventListeners();
    }

    render() {
        // Create tab buttons
        const tabButtons = document.createElement('div');
        tabButtons.className = 'tab-buttons';
        tabButtons.style.cssText = 'margin-bottom: 2rem;';

        this.tabs.forEach((tab, index) => {
            const button = document.createElement('button');
            button.textContent = tab.label;
            button.dataset.tab = index;
            button.style.cssText = `
                padding: 0.5rem 1rem;
                margin-right: 0.5rem;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 1rem;
                color: var(--color-text);
                opacity: ${index === this.activeTab ? '1' : '0.5'};
            `;
            tabButtons.appendChild(button);
        });

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content';
        contentContainer.innerHTML = this.tabs[this.activeTab].content;

        // Clear and append new content
        this.container.innerHTML = '';
        this.container.appendChild(tabButtons);
        this.container.appendChild(contentContainer);
    }

    addEventListeners() {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = parseInt(button.dataset.tab);
                this.setActiveTab(tabIndex);
            });
        });
    }

    setActiveTab(index) {
        this.activeTab = index;
        this.render();
    }
}
