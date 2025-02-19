export function drawerToggle() {
    const drawerToggle = document.querySelector(
        "[data-drawer-toggle='drawer-swipe']",
    );
    const drawer = document.getElementById("drawer-swipe");
    const contactoId = document.getElementById("contactoNav");

    if (drawer && contactoId) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    document.body.classList.contains("overflow-hidden")
                ) {
                    document.body.classList.remove("overflow-hidden");
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }
}