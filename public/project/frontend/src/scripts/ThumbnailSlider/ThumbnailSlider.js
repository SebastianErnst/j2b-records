//TODO: Jquery ausbauen
import $ from 'jquery';
import Swiper from '../../../node_modules/swiper/js/swiper.min';

export default class ThumbnailSlider {
    constructor(node) {
        const thumbnailSlider = new Swiper(node, {
            speed: 750,
            slidesPerView: 1,
            spaceBetween: 0,
            effect: 'fade',
            allowTouchMove: false,
            autoplay: {
                delay: 4000,
                disableOnInteraction: true
            },
        });
        thumbnailSlider.on('slideChange', function () {
            const index = thumbnailSlider.activeIndex;
            thumbnailList.find('li').removeClass('active');
            thumbnailList.find('li').eq(index).addClass('active');
        });

        const thumbnailList = $('[data-thumbnail-slider-thumbnail-list]');

        thumbnailList.on('click', (event) => {
            const item = $(event.target).closest('li');
            const index = item.index();
            thumbnailSlider.slideTo(index);
            thumbnailList.find('li').removeClass('active');
            item.addClass('active');
        });
    }
}