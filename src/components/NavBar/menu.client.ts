/**
 * Mobile menu toggle functionality for the NavBar component.
 * Handles hamburger menu open/close and dropdown interactions on mobile.
 */

// Initialize menu toggle functionality when DOM is ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(
      '[aria-label="Toggle navigation menu"]',
    ) as HTMLButtonElement;
    const navList = menuToggle?.parentElement?.querySelector("ul") as HTMLElement;
    const dropdownItems = document.querySelectorAll('li[class*="hasDropdown"]');

    if (menuToggle && navList) {
      // Toggle mobile menu
      menuToggle.addEventListener("click", () => {
        const isExpanded = navList.getAttribute("data-expanded") === "true";

        navList.setAttribute("data-expanded", String(!isExpanded));
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));

        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? "hidden" : "";
      });

      // Close menu when clicking outside
      document.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (
          navList.getAttribute("data-expanded") === "true" &&
          !navList.contains(target) &&
          !menuToggle.contains(target)
        ) {
          navList.setAttribute("data-expanded", "false");
          menuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });

      // Handle dropdown clicks on mobile
      dropdownItems.forEach((item) => {
        const link = item.querySelector('a[aria-haspopup="true"]') as HTMLAnchorElement;
        const dropdown = item.querySelector("ul");

        if (link && dropdown) {
          link.addEventListener("click", (event) => {
            // Only prevent default on mobile when clicking parent with dropdown
            if (window.innerWidth <= 768) {
              const hasDropdown = dropdown.children.length > 0;
              if (hasDropdown) {
                event.preventDefault();
                const isExpanded = item.getAttribute("data-expanded") === "true";

                // Close other dropdowns
                dropdownItems.forEach((otherItem) => {
                  if (otherItem !== item) {
                    otherItem.setAttribute("data-expanded", "false");
                  }
                });

                item.setAttribute("data-expanded", String(!isExpanded));
              }
            }
          });
        }
      });

      // Close menu on window resize to desktop
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          navList.setAttribute("data-expanded", "false");
          menuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }
  });
}
