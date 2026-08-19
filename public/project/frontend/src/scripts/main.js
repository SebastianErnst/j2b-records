import lazySizes from 'lazysizes';
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import ThumbnailSlider from "./ThumbnailSlider/ThumbnailSlider";
import MainNav from "./MainNav/MainNav";
import ArrowSlider from "./ArrowSlider/ArrowSlider";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
class Application {
    constructor() {

        this.initThumbnailSlider();
        this.initArrowSlider();
        this.initMainNav();
        this.initAudioPlayer();
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
}

new Application();