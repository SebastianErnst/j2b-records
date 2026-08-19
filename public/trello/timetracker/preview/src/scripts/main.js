class Main {
    constructor() {
        // const module = document.querySelector('[data-moddule]');
        const module = document.querySelector('body');
        console.log(module);
    }
    loadTimeTrackerIframe() {
        window.TrelloPowerUp.initialize({
            'card-back-section': function(t, options){
                return {
                    title: 'Zeiterfassung',
                    icon: '69',
                    content: {
                        type: 'iframe',
                        url: t.signUrl('../markup/timetracker.html'),
                        height: 500,
                    }
                };
            }
        });
    }
}

new Main();
