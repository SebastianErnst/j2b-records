import Amplitude from '../../../node_modules/amplitudejs/dist/amplitude.js';

export default class AudioPlayer {
    constructor(audioPlayerWrapper) {
        this.audioPlayerWrapper = audioPlayerWrapper;
        this.mediaPlayer = null;
        this.audioPlayer = this.audioPlayerWrapper.querySelector('audio');
        this.videoPlayer = this.audioPlayerWrapper.querySelector('video');
        this.image = this.audioPlayerWrapper.querySelector('[data-thumbnail]');
        this.nextButton = this.audioPlayerWrapper.querySelector('[data-next-song]');
        this.startStopButton = this.audioPlayerWrapper.querySelector('[data-start-stop]');
        this.prevButton = this.audioPlayerWrapper.querySelector('[data-prev-song]');
        this.fullscreenButton = this.audioPlayerWrapper.querySelector('[data-fullscreen]');
        this.volumeSlider = this.audioPlayerWrapper.querySelector('[data-volume]');
        this.songNodes = this.audioPlayerWrapper.querySelectorAll('[data-song]');
        this.songList = this.audioPlayerWrapper.querySelector('[data-song-list]');;
        this.songs = [];
        this.activeIndex = 0;
        this.songsCount = [...this.songNodes].length;
        this.progressBar = this.audioPlayerWrapper.querySelector('[data-progress]');
        this.type = null;
    }

    init() {
        this.parseSongsToObject();
        this.initSongNodes();
        this.changeSong(false);
        this.updateVolume();

        this.nextButton.addEventListener('click', () => {
            this.nextSong();
        });

        this.prevButton.addEventListener('click', () => {
            this.prevSong();
        });

        this.startStopButton.addEventListener('click', () => {
            if (this.startStopButton.classList.contains('is-playing')) {
                this.pause();
            } else {
                this.start();
            }
        });

        this.volumeSlider.addEventListener('input', (event) => {
             this.updateVolume();
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.progressBar.value = this.mediaPlayer.currentTime / this.mediaPlayer.duration * 100;
            if (parseInt(this.progressBar.value) === 100) {
                this.pause();
            }
        })
        this.videoPlayer.addEventListener('timeupdate', () => {
            this.progressBar.value = this.mediaPlayer.currentTime / this.mediaPlayer.duration * 100;
            if (parseInt(this.progressBar.value) === 100) {
                this.pause();
            }
        })
        this.progressBar.addEventListener('change', () => {
            this.mediaPlayer.currentTime = this.mediaPlayer.duration * (this.progressBar.value / 100);
            if (parseInt(this.progressBar.value) === 100) {
                this.pause();
            }
        });
        this.fullscreenButton.addEventListener('click', () => {
            this.videoPlayer.requestFullscreen();
        });
        this.videoPlayer.addEventListener('fullscreenchange', () => {
            if (this.videoPlayer.controls === true) {
                this.videoPlayer.controls = false;
            } else {
                this.videoPlayer.controls = true;
            }
        });
    }
    updateVolume() {
        this.mediaPlayer.volume = this.volumeSlider.value / 100;
    }

    initSongNodes() {
        this.songNodes.forEach((songNode) => {
            songNode.addEventListener('click', () => {
                this.activeIndex = this.getSongNodeIndex(songNode);
                this.changeSong();
            });
        });
    }
    parseSongsToObject() {
        this.songNodes.forEach((songNode) => {
            this.songs.push(this.getSongNodeInfo(songNode));
        });
    }
    getSongNodeInfo(song) {
        return {
            "title": song.dataset.title,
            "artist": song.dataset.artist,
            "url": song.dataset.url,
            "image": song.dataset.coverArt,
            "type": song.dataset.type
        }
    }
    changeSong(startAfterChange = true) {
        if (this.activeIndex === this.songsCount) {
            this.activeIndex = 0;
        }
        if (this.activeIndex === -1) {
            this.activeIndex = this.songsCount - 1;
        }

        const currentActiveSongNode = this.songList.querySelector('.is-active');
        const newActiveSongNode = this.songNodes[this.activeIndex];

        currentActiveSongNode.classList.remove('is-active');
        newActiveSongNode.classList.add('is-active');

        this.type = this.songs[this.activeIndex].type;

        this.progressBar.value = 0;
        this.pause();

        if (this.type === 'audio') {
            this.mediaPlayer = this.audioPlayer;
            this.image.setAttribute('src', this.songs[this.activeIndex].image);
            this.audioPlayer.src = this.songs[this.activeIndex].url;
            this.hideVideoPlayer();
            this.showThumbnail();
        }
        if (this.type === 'video') {
            this.mediaPlayer = this.videoPlayer;
            this.videoPlayer.src = this.songs[this.activeIndex].url;
            this.hideThumbnail();
            this.showVideoPlayer();
        }
        if (startAfterChange === true) {
            this.start();
        }
    }
    hideVideoPlayer() {
        this.videoPlayer.classList.remove('is-active');
        this.fullscreenButton.classList.remove('is-active');
    }
    showVideoPlayer() {
        this.videoPlayer.classList.add('is-active');
        this.fullscreenButton.classList.add('is-active');
    }
    hideThumbnail() {
        this.image.classList.remove('is-active');
    }
    showThumbnail() {
        this.image.classList.add('is-active');
    }
    prevSong() {
        this.activeIndex--;
        this.changeSong();
    }
    nextSong() {
        this.activeIndex++;
        this.changeSong();
    }
    start() {
        if (this.mediaPlayer === null) {
            return;
        }
        this.mediaPlayer.play();
        this.startStopButton.classList.add('is-playing');
    }
    pause() {
        if (this.mediaPlayer === null) {
            return;
        }
        this.mediaPlayer.pause();
        this.startStopButton.classList.remove('is-playing');
    }
    getSongNodeIndex(songNode) {
        return [...this.songNodes].indexOf(songNode);
    }
}