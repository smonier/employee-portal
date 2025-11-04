import type { JCRNodeWrapper } from "org.jahia.services.content";

export type Props = {
  "jcr:title": string;
  "jemp:summary"?: string;
  "jemp:start"?: string;
  "jemp:end"?: string;
  "jemp:location"?: string;
  "jemp:requiresRSVP"?: boolean;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
};
