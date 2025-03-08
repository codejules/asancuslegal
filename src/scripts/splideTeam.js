import Splide from "@splidejs/splide";
import '@splidejs/splide/css';

export function initSlider() {
    const sliderElement = document.querySelector("#image-slider");
    if (sliderElement && !sliderElement.splide) {
        new Splide(sliderElement, {
            type: "loop",
            drag: "free",
            gap: ".5rem",
            focus: "center",
            perPage: 2,
            width: "100%",
            arrows: false,
        }).mount();
    }
}
