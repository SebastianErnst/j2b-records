class Application {
    constructor() {
        this.initMainNav();
    }
    initMainNav() {
        const $triggerMainMenu = document.querySelector('[data-trigger-main-menu]');
        const $targetMainMenu = document.querySelector('[data-target-main-menu]');

        $triggerMainMenu.addEventListener('click', () => {
            const hasClassIsActive = $targetMainMenu.classList.contains('is-active');

            if (hasClassIsActive) {
                $targetMainMenu.classList.remove('is-active');
            } else {
                $targetMainMenu.classList.add('is-active');
            }
        });
    }
}

new Application();