import Splide from "@splidejs/splide";
import '@splidejs/splide/css';

export function initSlider() {
    const sliderElement = document.querySelector("#image-slider");
    if (sliderElement && !sliderElement.splide) {
        new Splide(sliderElement, {
            type: "loop",
            perPage: 1,
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            arrows: false,
            pagination: false,
            cover: true,
            height: "550px",
            width: "400px",
        }).mount();
    }
}
