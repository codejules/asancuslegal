import Splide from "@splidejs/splide";
import '@splidejs/splide/css';

export function initSlider() {
    const sliderElement = document.querySelector("#image-slider");

    if (sliderElement && !sliderElement.splide) {

        // Get the number of slides
        const slides = sliderElement.querySelectorAll('.splide__slide');
        const slideCount = slides.length;
        const showArrows = slideCount > 2;
        const showGap = slideCount <= 2 ? '3rem' : '0rem';

        new Splide(sliderElement, {
            drag: "free",
            focus: "center",
            gap: showGap,
            perPage: 2,
            width: "70%",
            arrows: showArrows,
            pagination: false,
            breakpoints: {
                1024: { perPage: 2, width: "100%", gap: "1rem" },
                769: { perPage: 2, width: "100%", gap: "1rem" },
                425: { perPage: 1, width: "100%", gap: "1rem", arrows: true },
                375: { perPage: 1, width: "100%", gap: "1rem", arrows: true },
            },
        }).mount();
    }
}
