import type { JCRNodeWrapper } from "org.jahia.services.content";

export type JobPostingNode = JCRNodeWrapper & {
  "jcr:title": string;
  "jemp:subtitle"?: string;
  "jemp:summary"?: string;
  "jemp:description"?: string;
  "jemp:department"?: string;
  "jemp:employmentType"?: string;
  "jemp:workplaceType"?: string;
  "jemp:experienceLevel"?: string;
  "jemp:jobLocation"?: string;
  "jemp:addressLocality"?: string;
  "jemp:addressRegion"?: string;
  "jemp:postalCode"?: string;
  "jemp:country"?: string;
  "jemp:salaryRange"?: string;
  "jemp:salaryCurrency"?: string;
  "jemp:salaryMin"?: string;
  "jemp:salaryMax"?: string;
  "jemp:applyUrl"?: string;
  "jemp:datePosted"?: string;
  "jemp:validThrough"?: string;
  "jemp:company"?: string;
  "jemp:companyUrl"?: string;
  "jemp:jobId"?: string;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
};

export type JobPostingProps = JobPostingNode;
