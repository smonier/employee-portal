import type { JCRNodeWrapper } from "org.jahia.services.content";

export type NewsNode = JCRNodeWrapper & {
  "jcr:title": string;
  "jemp:summary"?: string;
  "jemp:body"?: string;
  "jemp:heroImage"?: JCRNodeWrapper;
  "jemp:publishDate"?: string;
};

export type Props = NewsNode;
