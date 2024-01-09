//TODO: Jquery ausbauen
import $ from 'jquery';
import Swiper from '../../../node_modules/swiper/js/swiper.min';

export default class ServiceSlider {
    constructor(node) {
        const $serviceSlider = node;
        const serviceSlider = new Swiper($serviceSlider, {
            speed: 750,
            slidesPerView: 1,
            spaceBetween: 60,
            autoplay: {
                delay: 5000
            },
            navigation: {
                nextEl: $serviceSlider.querySelector('.next'),
                prevEl: $serviceSlider.querySelector('.previous')
            }
        });
    }
}