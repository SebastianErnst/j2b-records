//TODO: Jquery ausbauen
import $ from 'jquery';
import Swiper from '../../../node_modules/swiper/js/swiper.min';

export default class FeatureSlider {
    constructor(node) {
        const featureSlider = new Swiper(node, {
            speed: 750, slidesPerView: 1, spaceBetween: 0, effect: 'fade', allowTouchMove: false, autoplay: {
                delay: 5000
            }

        });
        featureSlider.on('slideChange', function () {
            const index = featureSlider.activeIndex;
            thumbnailList.find('li').removeClass('active');
            thumbnailList.find('li').eq(index).addClass('active');
        });

        const thumbnailList = $('[data-feature-slider-thumbnail-list]');

        thumbnailList.on('click', (event) => {
            const item = $(event.target).closest('li');
            const index = item.index();
            featureSlider.slideTo(index);
            thumbnailList.find('li').removeClass('active');
            item.addClass('active');
        });
    }
}