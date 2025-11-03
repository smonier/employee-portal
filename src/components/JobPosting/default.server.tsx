import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";
import classes from "./component.module.css";
import { buildJobPostingJsonLd, formatDate, formatSalary, resolveLocale, toIsoDate } from "./utils";

type MetaEntry = { label: string; value?: string; itemProp?: string };

const metaEntries = (props: JobPostingProps, locale: string): MetaEntry[] => {
  return [
    {
      label: t("jobPosting.meta.department", "Department"),
      value: props["jemp:department"],
    },
    {
      label: t("jobPosting.meta.location", "Location"),
      value: props["jemp:jobLocation"],
    },
    {
      label: t("jobPosting.meta.employmentType", "Employment type"),
      value: props["jemp:employmentType"],
      itemProp: "employmentType",
    },
    {
      label: t("jobPosting.meta.workplace", "Workplace"),
      value: props["jemp:workplaceType"],
      itemProp: "jobLocationType",
    },
    {
      label: t("jobPosting.meta.experience", "Experience level"),
      value: props["jemp:experienceLevel"],
    },
    {
      label: t("jobPosting.meta.salary", "Salary"),
      value: formatSalary(props, locale),
    },
    {
      label: t("jobPosting.meta.posted", "Posted"),
      value: formatDate(props["jemp:datePosted"], locale),
    },
    {
      label: t("jobPosting.meta.validThrough", "Apply by"),
      value: formatDate(props["jemp:validThrough"], locale),
    },
  ].filter((entry) => entry.value);
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:jobPosting",
    name: "default",
    displayName: "Job Posting",
  },
  (rawProps: JobPostingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;
    const applyUrl = props["jemp:applyUrl"];
    const companyName = props["jemp:company"];
    const companyUrl = props["jemp:companyUrl"];
    const kicker =
      props["jemp:subtitle"] ||
      [companyName, props["jemp:department"]].filter((value) => value && value.length > 0).join(" • ");

    const summary = props["jemp:summary"];
    const description = props["jemp:description"];
    const entries = metaEntries(props, locale);
    const jsonLd = buildJobPostingJsonLd(props, locale, applyUrl, t("jobPosting.schema.remoteFriendly", "Remote"));
    const datePostedIso = toIsoDate(props["jemp:datePosted"]);
    const validThroughIso = toIsoDate(props["jemp:validThrough"]);

    return (
      <article className={classes.card} itemScope itemType="https://schema.org/JobPosting">
        <header className={classes.header}>
          <div className={classes.badgeRow}>
            <span className={classes.badge}>{t("jobPosting.label.badge", "Now hiring")}</span>
            {props["jemp:employmentType"] && <span className={classes.badge}>{props["jemp:employmentType"]}</span>}
            {props["jemp:workplaceType"] && <span className={classes.badge}>{props["jemp:workplaceType"]}</span>}
          </div>
          {kicker && (
            <p className={classes.subtitle}>
              {kicker}
            </p>
          )}
          <h2 className={classes.title} itemProp="title">
            {props["jcr:title"]}
          </h2>
          {summary && <p className={classes.summary}>{summary}</p>}
        </header>

        {entries.length > 0 && (
          <div className={classes.metaGrid}>
            {entries.map((entry) => (
              <div className={classes.metaItem} key={`${entry.label}-${entry.value}`}>
                <span className={classes.metaLabel}>{entry.label}</span>
                <span className={classes.metaValue} {...(entry.itemProp ? { itemProp: entry.itemProp } : {})}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {description && (
          <div className={classes.description} dangerouslySetInnerHTML={{ __html: description }} itemProp="description" />
        )}

        <div className={classes.ctaRow}>
          {applyUrl && (
            <a className={classes.primaryCta} href={applyUrl} target="_blank" rel="noopener noreferrer">
              {t("jobPosting.cta.apply", "Apply now")}
            </a>
          )}
          {companyUrl && (
            <a className={classes.secondaryLink} href={companyUrl} target="_blank" rel="noopener noreferrer">
              {t("jobPosting.cta.companySite", "View company site")}
            </a>
          )}
        </div>

        <script
          type="application/ld+json"
          className={classes.schemaScript}
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />

        {props["jemp:employmentType"] && (
          <meta itemProp="employmentType" content={props["jemp:employmentType"]} />
        )}
        {props["jemp:workplaceType"] && <meta itemProp="jobLocationType" content={props["jemp:workplaceType"]} />}
        {applyUrl && <meta itemProp="directApply" content="true" />}
        {datePostedIso && <meta itemProp="datePosted" content={datePostedIso} />}
        {validThroughIso && <meta itemProp="validThrough" content={validThroughIso} />}

        {(companyName || companyUrl) && (
          <span itemProp="hiringOrganization" itemScope itemType="https://schema.org/Organization" hidden>
            {companyName && <meta itemProp="name" content={companyName} />}
            {companyUrl && <meta itemProp="sameAs" content={companyUrl} />}
          </span>
        )}

        {(props["jemp:jobLocation"] ||
          props["jemp:addressLocality"] ||
          props["jemp:addressRegion"] ||
          props["jemp:postalCode"] ||
          props["jemp:country"]) && (
          <span itemProp="jobLocation" itemScope itemType="https://schema.org/Place" hidden>
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              {props["jemp:jobLocation"] && <meta itemProp="streetAddress" content={props["jemp:jobLocation"]} />}
              {props["jemp:addressLocality"] && <meta itemProp="addressLocality" content={props["jemp:addressLocality"]} />}
              {props["jemp:addressRegion"] && <meta itemProp="addressRegion" content={props["jemp:addressRegion"]} />}
              {props["jemp:postalCode"] && <meta itemProp="postalCode" content={props["jemp:postalCode"]} />}
              {props["jemp:country"] && <meta itemProp="addressCountry" content={props["jemp:country"]} />}
            </span>
          </span>
        )}
      </article>
    );
  },
);
