import "./klaroConfig";
import lazySizes from 'lazysizes';
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import ThumbnailSlider from "./ThumbnailSlider/ThumbnailSlider";
import MainNav from "./MainNav/MainNav";
import ArrowSlider from "./ArrowSlider/ArrowSlider";
import YoutubePlaylist from "./YoutubePlaylist/YoutubePlaylist";
class Application {
    constructor() {

        this.initThumbnailSlider();
        this.initArrowSlider();
        this.initMainNav();
        this.initYoutubePlaylist();
        this.initScrollAfterFormSend();
    }

    initScrollAfterFormSend() {
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);

            if (urlParams.get('send') === 'true') {
                const contactElement = document.getElementById('contact');

                if (contactElement) {
                    contactElement.scrollIntoView();
                }

                urlParams.delete('send');
                const newUrl = window.location.pathname + urlParams.toString();
                history.replaceState(null, '', newUrl);
            }
        });

    }
    initMainNav() {
        const mainNavs = document.querySelectorAll('[data-main-nav]');

        mainNavs.forEach((mainNav) => {
            new MainNav(mainNav);
        });
    }

    initThumbnailSlider() {
        const thumbnailSliders = document.querySelectorAll('[data-thumbnail-slider]');

        thumbnailSliders.forEach((thumbnailSlider) => {
            new ThumbnailSlider(thumbnailSlider);
        });
    }

    initArrowSlider() {
        const arrowSliders = document.querySelectorAll('[data-arrow-slider]');

        arrowSliders.forEach((arrowSlider) => {
            new ArrowSlider(arrowSlider);
        });
    }

    initYoutubePlaylist() {
        const youtubePlaylistWrappers = document.querySelectorAll('[data-youtube-playlist]');

        youtubePlaylistWrappers.forEach((youtubePlaylistWrapper) => {
            new YoutubePlaylist(youtubePlaylistWrapper);
        });
    }
}

new Application();

