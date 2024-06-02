const mobileMedia = window.matchMedia("(max-width: 768px)");

// Checks to see if the page layout changes to desktop or mobile layout
mobileMedia.onchange = (e) => {
    setNavStatePerLayout(!e.matches);
};

/**
 * Set up initial function of the navigation menu.
 */
export function setUpNav() {
    const navButton = document.getElementById("nav-button");
    const navOverlay = document.getElementById("nav-overlay");

    setNavStatePerLayout(!mobileMedia.matches);

    // When mobile navigation is open, clicking the menu button or overlay will
    // close it
    [navButton, navOverlay].forEach((element) => {
        element.addEventListener("click", () => {
            toggleMobileNav();
        });
    });

    // When mobile navigation is open, scrolling will close it
    document.addEventListener("scroll", (e) => {
        if (navButton.getAttribute("aria-expanded") === "true") {
            toggleMobileNav();
        }
    });
}

/**
 * Set the functionality of the navigation button and links based on whether the
 * page is on desktop or mobile layout.
 * @param {boolean} isDesktop   Page is on desktop layout
 */
function setNavStatePerLayout(isDesktop) {
    const button = document.getElementById("nav-button");

    button.setAttribute("aria-hidden", `${isDesktop}`);
    button.setAttribute("tabindex", isDesktop ? "-1" : "0");
    button.setAttribute("aria-label", "Open navigation");
    button.setAttribute("aria-expanded", "false");

    setNavLinksTabindex(isDesktop);
}

/**
 * Toggle mobile navigation between open or closed.
 */
function toggleMobileNav() {
    const button = document.getElementById("nav-button");

    // Nav is currently open, set to close
    if (button.getAttribute("aria-expanded") === "true") {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation");
        setNavLinksTabindex(false);
    }
    // Nav is currently closed, set to open
    else {
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close navigation");
        setNavLinksTabindex(true);
    }
}

/**
 * Set the tabindex of navigation links based on layout or if mobile navigation
 * is open.
 * @param {boolean} isDesktopOrOpenNav  The page is on desktop layout or mobile
 *                                      navigation is open
 */
function setNavLinksTabindex(isDesktopOrOpenNav) {
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {
        link.setAttribute("tabindex", isDesktopOrOpenNav ? "0" : "-1");
    });
}
