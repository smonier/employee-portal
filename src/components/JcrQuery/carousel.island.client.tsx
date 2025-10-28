import { useEffect } from "react";

const CarouselIsland = () => {
  useEffect(() => {
    // Dynamically import the carousel logic
    import("./carousel.client.js");
  }, []);
  return null;
};

export default CarouselIsland;
