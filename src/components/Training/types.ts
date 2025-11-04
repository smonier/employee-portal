import type { JCRNodeWrapper } from "org.jahia.services.content";

export type TrainingProps = {
  node?: JCRNodeWrapper;
  "jcr:title": string;
  "jemp:summary"?: string;
  "jemp:description"?: string;
  "jemp:startDate"?: string;
  "jemp:endDate"?: string;
  "jemp:duration"?: string;
  "jemp:deliveryMode"?: string;
  "jemp:location"?: string;
  "jemp:providerName"?: string;
  "jemp:providerUrl"?: string;
  "jemp:skillLevel"?: string;
  "jemp:audience"?: string;
  "jemp:format"?: string;
  "jemp:cost"?: string;
  "jemp:heroImage"?: JCRNodeWrapper | string | null;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
  [key: string]: unknown;
};

export type TrainingCardProps = TrainingProps & {
  currentNode?: JCRNodeWrapper;
};
