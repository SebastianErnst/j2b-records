import FeatureSlider from "./FeatureSlider/FeatureSlider";
import ServiceSlider from "./ServiceSlider/ServiceSlider";
import MainNav from "./MainNav/MainNav";
class Application {
    constructor() {
        this.initFeatureSlider();
        this.initServiceSlider();
        this.initMainNav();
    }

    initMainNav() {
        const mainNavs = document.querySelectorAll('[data-main-nav]');

        mainNavs.forEach((mainNav) => {
            new MainNav(mainNav);
        });
    }

    initFeatureSlider() {
        const feautureSliders = document.querySelectorAll('[data-feature-slider]');

        feautureSliders.forEach((feautureSlider) => {
            new FeatureSlider(feautureSlider);
        });
    }

    initServiceSlider() {
        const serviceSliders = document.querySelectorAll('[data-service-slider]');

        serviceSliders.forEach((serviceSlider) => {
            new ServiceSlider(serviceSlider);
        });
    }

}

new Application();