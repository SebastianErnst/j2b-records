export default class YoutubePlaylist {
    constructor(node) {
        const iframe = node.querySelector('iframe');
        node.querySelectorAll('li').forEach(li => {

            li.addEventListener('click', () => {
                // if (window.klaro.getManager().loadConsents().youtube === false) {
                //     return;
                // }
                const activeSong = node.querySelector('li.is-active');
                if (activeSong) {
                    activeSong.classList.remove('is-active');
                }
                li.classList.add('is-active');
                iframe.src = li.getAttribute('data-youtube-embed-url');
            });
        });
    }
}