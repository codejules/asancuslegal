class MenuBurguer extends HTMLElement {
    connectedCallback() {
        const hamburger = document.querySelector("#nav-burguer");
        const navList = document.querySelector("#nav-list");
        const languageSelector = document.querySelector("[data-language-selector]");

        if (hamburger && navList) {
            // Toggle menu on hamburger click
            hamburger.addEventListener("click", (e) => {
                e.stopPropagation();
                hamburger.classList.toggle("active");
                navList.classList.toggle("active");
            });

            // Handle clicks within the nav list
            navList.addEventListener("click", (e) => {
                if (languageSelector?.contains(e.target as Node)) {
                    e.stopPropagation();
                    return;
                }
                if ((e.target as Element).closest("#nav-item")) {
                    hamburger.classList.remove("active");
                    navList.classList.remove("active");
                }
            });

            // Close menu when clicking outside
            document.addEventListener("click", (e) => {
                if (!hamburger.contains(e.target as Node) && !navList.contains(e.target as Node)) {
                    hamburger.classList.remove("active");
                    navList.classList.remove("active");
                }
            });
        }
    }
}

// Registrar el componente solo si no está definido
if (!customElements.get("menu-burguer")) {
    customElements.define("menu-burguer", MenuBurguer);
}
