/**
 * Close alert banner and store dismissal in sessionStorage
 */
function hideAlertWithAnimation(banner: HTMLElement) {
  banner.style.opacity = "0";
  banner.style.transform = "translateX(20px)";
  setTimeout(() => {
    banner.style.display = "none";
  }, 300);
}

function hideDismissedAlerts() {
  const alerts = document.querySelectorAll("[data-alert-id]");
  alerts.forEach((alert) => {
    const alertId = (alert as HTMLElement).dataset.alertId;
    if (alertId && sessionStorage.getItem(`alert-dismissed-${alertId}`) === "true") {
      (alert as HTMLElement).style.display = "none";
    }
  });
}

function initCloseButtons() {
  // Remove existing listeners by cloning buttons
  const closeButtons = document.querySelectorAll("[data-alert-close]");

  closeButtons.forEach((button) => {
    // Clone to remove old listeners
    const newButton = button.cloneNode(true) as HTMLElement;
    button.parentNode?.replaceChild(newButton, button);

    // Add fresh listener
    newButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const alertId = newButton.dataset.alertClose;
      console.log("Close button clicked, alertId:", alertId);

      if (alertId) {
        // Store dismissal in sessionStorage
        sessionStorage.setItem(`alert-dismissed-${alertId}`, "true");
        console.log("Stored dismissal for:", alertId);

        // Hide the alert with animation
        const banner = newButton.closest("[data-alert-id]");
        if (banner) {
          hideAlertWithAnimation(banner as HTMLElement);
        }
      }
    });
  });
}

export function initAlertClose() {
  console.log("Initializing alert close functionality");
  hideDismissedAlerts();
  initCloseButtons();
}

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAlertClose);
} else {
  initAlertClose();
}

// Re-initialize after a short delay to catch dynamically loaded content
setTimeout(initAlertClose, 500);
