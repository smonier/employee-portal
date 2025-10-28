import type { JCRNodeWrapper } from "org.jahia.services.content";

export type HeroProps = {
  "jcr:title": string;
  "jemp:subtitle"?: string;
  "jemp:ctaLabel"?: string;
  "jemp:backgroundImage"?: JCRNodeWrapper | string | null;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
  [key: string]: unknown;
};
