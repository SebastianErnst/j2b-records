//TODO: Jquery ausbauen
import Swiper from '../../../node_modules/swiper/js/swiper.min';

export default class ArrowSlider {
    constructor(node) {
        const $arrowSlider = node;
        new Swiper($arrowSlider, {
            speed: 750,
            slidesPerView: 1,
            spaceBetween: 60,
            navigation: {
                nextEl: $arrowSlider.querySelector('.next'),
                prevEl: $arrowSlider.querySelector('.previous')
            }
        });
    }
}