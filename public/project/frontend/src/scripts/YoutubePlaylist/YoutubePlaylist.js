export default class YoutubePlaylist {
    constructor(node) {
        const iframe = node.querySelector('iframe');

        const loadIframe = (url) => {
            const manager = window.klaro && window.klaro.getManager();
            if (manager && !manager.getConsent('youtube')) {
                window.klaro.show(undefined, true);
                return;
            }
            iframe.src = url;
        };

        loadIframe(iframe.getAttribute('data-src'));

        // Klaro's global addEventListener() only fires for 'render'/'apiConfigsLoaded'/'apiConfigsFailed';
        // consent changes are only reported via the manager's watch() API.
        const manager = window.klaro && window.klaro.getManager();
        if (manager) {
            manager.watch({
                update: (_manager, eventType, consents) => {
                    if (eventType === 'consents' && consents.youtube && !iframe.src) {
                        const activeSong = node.querySelector('li.is-active');
                        if (activeSong) {
                            loadIframe(activeSong.getAttribute('data-youtube-embed-url'));
                        }
                    }
                },
            });
        }

        node.querySelectorAll('li').forEach(li => {

            li.addEventListener('click', () => {
                const activeSong = node.querySelector('li.is-active');
                if (activeSong) {
                    activeSong.classList.remove('is-active');
                }
                li.classList.add('is-active');
                loadIframe(li.getAttribute('data-youtube-embed-url'));
            });
        });
    }
}