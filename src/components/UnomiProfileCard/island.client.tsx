import type { FC } from "react";
import { UnomiProfileCard } from "./index";

/**
 * Client entry point for the UnomiProfileCard island.
 * Delegates rendering to the shared React component.
 */
type IslandProps = {
  title?: string;
  name?: string;
};

const UnomiProfileCardIsland: FC<IslandProps> = (props) => <UnomiProfileCard {...props} />;

export default UnomiProfileCardIsland;
