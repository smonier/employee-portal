import { buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";

export type LinkToProps = {
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
};

export type ResolvedLink = {
  href?: string;
  target?: string;
  rel?: string;
};

const buildInternalUrl = (value: LinkToProps["seu:internalLink"]) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "getPath" in value && typeof value.getPath === "function") {
    return buildNodeUrl(value as JCRNodeWrapper);
  }
  return undefined;
};

export const resolveLink = (props: LinkToProps, fallbackUrl?: string): ResolvedLink => {
  const linkType = props["seu:linkType"];
  const rawTarget = props["seu:linkTarget"];
  const linkTarget = rawTarget && rawTarget !== "" ? rawTarget : undefined;
  const externalLink = props["seu:externalLink"];
  const internalLink = props["seu:internalLink"];
  let href: string | undefined;

  if (linkType === "externalLink" && typeof externalLink === "string") {
    href = externalLink;
  } else if (linkType === "internalLink" && internalLink) {
    href = buildInternalUrl(internalLink);
  } else if (linkType === "self") {
    href = "#";
  } else if (!linkType) {
    href =
      (typeof fallbackUrl === "string" && fallbackUrl) ||
      buildInternalUrl(internalLink) ||
      (typeof externalLink === "string" ? externalLink : undefined);
  }

  if (!href) {
    href = fallbackUrl;
  }

  const rel = linkTarget === "_blank" ? "noopener noreferrer" : undefined;

  return { href, target: linkTarget, rel };
};
