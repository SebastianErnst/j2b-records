import './klaroConfig';
import lazySizes from 'lazysizes';
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import ThumbnailSlider from "./ThumbnailSlider/ThumbnailSlider";
import MainNav from "./MainNav/MainNav";
import ArrowSlider from "./ArrowSlider/ArrowSlider";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import YoutubePlaylist from './YoutubePlaylist/YoutubePlaylist';

class Application {
    constructor() {

        this.initThumbnailSlider();
        this.initArrowSlider();
        this.initMainNav();
        this.initAudioPlayer();
        this.initImageGalleries();
        this.initYoutubePlaylists();
        this.initCookieSettings();
    }

    initCookieSettings() {
        document.querySelectorAll('[data-klaro-show]').forEach((button) => {
            button.addEventListener('click', () => {
                window.klaro && window.klaro.show();
            });
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

    initAudioPlayer() {
        const audioPlayerWrappers = document.querySelectorAll('[data-audio-player]');

        audioPlayerWrappers.forEach((audioPlayerWrapper) => {
            const audioPlayer = new AudioPlayer(audioPlayerWrapper);
            audioPlayer.init();
        });
    }

    initYoutubePlaylists() {
        const youtubePlaylists = document.querySelectorAll('[data-youtube-playlist]');

        youtubePlaylists.forEach((youtubePlaylist) => {
            new YoutubePlaylist(youtubePlaylist);
        });
    }

    initImageGalleries() {
        document.querySelectorAll('[data-image-gallery]').forEach((gallery) => {
            lightGallery(gallery, {
                plugins: [],
                selector: '[data-image-gallery-item]',
                download: false
            });
        });
    }
}

new Application();