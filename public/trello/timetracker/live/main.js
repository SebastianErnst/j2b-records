class Main {
    constructor() {
        this.loadTimeTrackerIframe();
    }
    loadTimeTrackerIframe() {
        window.TrelloPowerUp.initialize({
            'card-back-section': function(t, options){
                return {
                    title: 'Zeiterfassung',
                    icon: '69',
                    content: {
                        type: 'iframe',
                        url: t.signUrl('./markup/timetracker.html'),
                        height: 500,
                    }
                };
            }
        });
    }
}

new Main();