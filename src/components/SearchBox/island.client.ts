/**
 * Client-side search box functionality
 * Handles form submission and redirects to search results page
 */

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector("[data-search-box]");

    if (searchBox) {
      const form = searchBox.querySelector("form");

      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          const input = form.querySelector('input[name="q"]') as HTMLInputElement;
          const query = input?.value.trim();

          if (query) {
            // Redirect to search results page with query parameter
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }
        });
      }
    }
  });
}
