import type { JCRNodeWrapper } from "org.jahia.services.content";

export type QuickLinkProps = {
  "jcr:title": string;
  "jemp:icon"?: string;
  "jemp:url"?: string;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper;
};
