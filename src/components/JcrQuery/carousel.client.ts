// Carousel controller with hydration
class CarouselController {
  private carousel!: HTMLElement;
  private track!: HTMLElement;
  private slides!: HTMLElement[];
  private indicators!: HTMLButtonElement[];
  private prevButton!: HTMLButtonElement | null;
  private nextButton!: HTMLButtonElement | null;
  private currentIndex: number = 0;
  private autoplayInterval: number | null = null;
  private readonly autoplayDelay: number = 5000; // 5 seconds

  constructor(carouselId: string) {
    const carousel = document.querySelector(`[data-carousel-id="${carouselId}"]`) as HTMLElement;
    if (!carousel) {
      console.warn(`Carousel with id "${carouselId}" not found`);
      return;
    }

    this.carousel = carousel;
    this.track = carousel.querySelector("[data-carousel-track]") as HTMLElement;
    this.slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    this.indicators = Array.from(
      document.querySelectorAll(`[data-carousel-indicator="${carouselId}"]`),
    );
    this.prevButton = document.querySelector(`[data-carousel-prev="${carouselId}"]`);
    this.nextButton = document.querySelector(`[data-carousel-next="${carouselId}"]`);

    // Validate required elements
    if (!this.track || this.slides.length === 0) {
      console.error(`Carousel ${carouselId}: Missing track or slides`, {
        hasTrack: !!this.track,
        slideCount: this.slides.length,
      });
      return;
    }

    console.log(`Carousel initialized: ${carouselId}`, {
      slides: this.slides.length,
      indicators: this.indicators.length,
      hasTrack: !!this.track,
      hasPrevButton: !!this.prevButton,
      hasNextButton: !!this.nextButton,
    });

    this.init();
  }

  private init(): void {
    // Set up button listeners
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => {
        console.log("Prev button clicked");
        this.prev();
      });
    }
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => {
        console.log("Next button clicked");
        this.next();
      });
    }

    // Set up indicator listeners
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        console.log("Indicator clicked:", index);
        this.goTo(index);
      });
    });

    // Keyboard navigation
    this.carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prev();
      } else if (e.key === "ArrowRight") {
        this.next();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        this.next();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        this.prev();
      }
    };

    this.carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.carousel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    // Start autoplay
    this.startAutoplay();

    // Pause on hover
    this.carousel.addEventListener("mouseenter", () => this.stopAutoplay());
    this.carousel.addEventListener("mouseleave", () => this.startAutoplay());

    // Initial position
    this.updateCarousel();
  }

  private goTo(index: number): void {
    console.log(`goTo called: ${index}, current: ${this.currentIndex}`);
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  private next(): void {
    console.log(`next called, current: ${this.currentIndex}, total: ${this.slides.length}`);
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  private prev(): void {
    console.log(`prev called, current: ${this.currentIndex}, total: ${this.slides.length}`);
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  private updateCarousel(): void {
    if (!this.track || !this.slides || this.slides.length === 0) {
      console.error("Carousel update failed: missing track or slides");
      return;
    }

    console.log(`updateCarousel: currentIndex=${this.currentIndex}`);

    // Move track
    const slideWidth = this.slides[0].offsetWidth;
    const translateX = -this.currentIndex * slideWidth;
    console.log(`Moving track: slideWidth=${slideWidth}px, translateX=${translateX}px`);
    this.track.style.transform = `translateX(${translateX}px)`;

    // Update indicators - use data-active attribute
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.setAttribute("data-active", "true");
      } else {
        indicator.removeAttribute("data-active");
      }
    });

    // Update button states
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.prevButton.style.opacity = this.currentIndex === 0 ? "0.5" : "1";
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
      this.nextButton.style.opacity = this.currentIndex === this.slides.length - 1 ? "0.5" : "1";
    }
  }

  private startAutoplay(): void {
    if (this.slides.length <= 1) return;

    this.autoplayInterval = window.setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval !== null) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// Track initialized carousels to prevent double-initialization
const initializedCarousels = new Set<string>();

// Initialize all carousels on the page
function initCarousels(): void {
  console.log("initCarousels called, readyState:", document.readyState);
  const carousels = document.querySelectorAll("[data-carousel-id]");
  console.log("Found carousels:", carousels.length);
  carousels.forEach((carousel) => {
    const carouselId = carousel.getAttribute("data-carousel-id");
    if (carouselId && !initializedCarousels.has(carouselId)) {
      console.log("Initializing carousel:", carouselId);
      initializedCarousels.add(carouselId);
      new CarouselController(carouselId);
    } else if (carouselId) {
      console.log("Carousel already initialized:", carouselId);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  console.log("DOM is loading, adding DOMContentLoaded listener");
  document.addEventListener("DOMContentLoaded", initCarousels);
} else {
  console.log("DOM already loaded, initializing immediately");
  initCarousels();
}

// Re-initialize on navigation (for SPAs) - will skip already initialized ones
window.addEventListener("load", initCarousels);

export {};
