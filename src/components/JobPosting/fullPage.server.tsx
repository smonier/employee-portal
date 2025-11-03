import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";
import classes from "./fullPage.module.css";
import {
  buildJobPostingJsonLd,
  formatDate,
  formatSalary,
  resolveApplyLink,
  resolveLocale,
  toIsoDate,
} from "./utils";

const formatLongDate = (value: string | undefined, locale: string) =>
  formatDate(value, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const joinAddress = (props: JobPostingProps) => {
  const parts = [
    props["jemp:jobLocation"],
    props["jemp:addressLocality"],
    props["jemp:addressRegion"],
    props["jemp:country"],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : undefined;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:jobPosting",
    name: "fullPage",
    displayName: "Job Posting - Full Page",
  },
  (rawProps: JobPostingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const description = props["jemp:description"];
    const employmentType = props["jemp:employmentType"];
    const workplace = props["jemp:workplaceType"];
    const department = props["jemp:department"];
    const experience = props["jemp:experienceLevel"];
    const companyName = props["jemp:company"];
    const companyUrl = props["jemp:companyUrl"];
    const applyLink = resolveApplyLink(props);
    const applyUrl = applyLink.href;
    const salary = formatSalary(props, locale);
    const location = joinAddress(props);
    const postedShort = formatDate(props["jemp:datePosted"], locale);
    const postedLong = formatLongDate(props["jemp:datePosted"], locale);
    const deadlineShort = formatDate(props["jemp:validThrough"], locale);
    const deadlineLong = formatLongDate(props["jemp:validThrough"], locale);
    const jsonLd = buildJobPostingJsonLd(
      props,
      locale,
      applyUrl,
      t("jobPosting.schema.remoteFriendly", "Remote"),
    );
    const datePostedIso = toIsoDate(props["jemp:datePosted"]);
    const validThroughIso = toIsoDate(props["jemp:validThrough"]);

    const heroBadges = [
      employmentType,
      workplace,
      experience,
      department,
    ].filter(Boolean);

    const highlightEntries = [
      {
        label: t("jobPosting.meta.location", "Location"),
        value: location || workplace || t("jobPosting.schema.remoteFriendly", "Remote"),
      },
      {
        label: t("jobPosting.meta.salary", "Salary"),
        value: salary,
      },
      {
        label: t("jobPosting.meta.posted", "Posted"),
        value: postedLong,
      },
      {
        label: t("jobPosting.meta.validThrough", "Apply by"),
        value: deadlineLong,
      },
    ].filter((entry) => entry.value);

    const snapshotFacts = [
      {
        label: t("jobPosting.meta.department", "Department"),
        value: department,
      },
      {
        label: t("jobPosting.meta.employmentType", "Employment type"),
        value: employmentType,
      },
      {
        label: t("jobPosting.meta.workplace", "Workplace"),
        value: workplace,
      },
      {
        label: t("jobPosting.meta.experience", "Experience level"),
        value: experience,
      },
      {
        label: t("jobPosting.meta.location", "Location"),
        value: location,
      },
      {
        label: t("jobPosting.meta.salary", "Salary"),
        value: salary,
      },
      {
        label: t("jobPosting.meta.posted", "Posted"),
        value: postedShort,
      },
      {
        label: t("jobPosting.meta.validThrough", "Apply by"),
        value: deadlineShort,
      },
      {
        label: t("jobPosting.meta.jobId", "Job ID"),
        value: props["jemp:jobId"],
      },
    ].filter((entry) => entry.value);

    const addressDetails = [
      props["jemp:jobLocation"],
      props["jemp:addressLocality"],
      props["jemp:addressRegion"],
      props["jemp:postalCode"],
      props["jemp:country"],
    ].filter(Boolean);

    return (
      <>
        <section className={classes.hero} itemScope itemType="https://schema.org/JobPosting">
          <div className={classes.heroOverlay} />
          <div className={classes.heroContent}>
            <div className={classes.heroMeta}>
              <span className={classes.heroChip}>{t("jobPosting.label.badge", "Now hiring")}</span>
              {department && <span className={classes.heroChip}>{department}</span>}
            </div>
            <div className={classes.heroBadges}>
              {heroBadges.map((badge) => (
                <span className={classes.heroBadge} key={badge}>
                  {badge}
                </span>
              ))}
            </div>
            <h1 className={classes.heroTitle} itemProp="title">
              {title}
            </h1>
            {summary && (
              <p className={classes.heroSummary} itemProp="description">
                {summary}
              </p>
            )}
            <div className={classes.heroFooter}>
              {applyUrl && (
                <a
                  href={applyUrl}
                  target={applyLink.target}
                  rel={applyLink.rel}
                  className={classes.ctaPrimary}
                >
                  {t("jobPosting.cta.apply", "Apply now")} →
                </a>
              )}
              {companyName && (
                <span className={classes.heroSecondary}>
                  {t("jobPosting.meta.company", "Hiring company")}:{" "}
                  {companyUrl ? (
                    <a href={companyUrl} target="_blank" rel="noopener noreferrer" className={classes.ctaSecondary}>
                      {companyName}
                    </a>
                  ) : (
                    companyName
                  )}
                </span>
              )}
            </div>
          </div>
          <script
            type="application/ld+json"
            className={classes.schemaScript}
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
          {applyUrl && <meta itemProp="directApply" content="true" />}
          {employmentType && <meta itemProp="employmentType" content={employmentType} />}
          {workplace && <meta itemProp="jobLocationType" content={workplace} />}
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
        </section>

        <section className={classes.page}>
          {highlightEntries.length > 0 && (
            <div className={classes.highlightGrid}>
              {highlightEntries.map((entry) => (
                <div className={classes.highlightCard} key={entry.label}>
                  <span className={classes.highlightLabel}>{entry.label}</span>
                  <span className={classes.highlightValue}>{entry.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className={classes.layout}>
            <div className={classes.mainContent}>
              {description && (
                <article className={classes.section}>
                  <h2 className={classes.sectionTitle}>{t("jobPosting.section.overview", "About the role")}</h2>
                  <div
                    className={classes.description}
                    dangerouslySetInnerHTML={{ __html: description }}
                    itemProp="description"
                  />
                </article>
              )}

              {addressDetails.length > 0 && (
                <article className={classes.section}>
                  <h2 className={classes.sectionTitle}>{t("jobPosting.section.location", "Where you'll work")}</h2>
                  <div className={classes.factGrid}>
                    <div className={classes.factItem}>
                      <span className={classes.factLabel}>{t("jobPosting.meta.location", "Location")}</span>
                      <span className={classes.factValue}>{location}</span>
                    </div>
                    {workplace && (
                      <div className={classes.factItem}>
                        <span className={classes.factLabel}>{t("jobPosting.meta.workplace", "Workplace")}</span>
                        <span className={classes.factValue}>{workplace}</span>
                      </div>
                    )}
                    {addressDetails.map((value, index) => (
                      <div className={classes.factItem} key={`${value}-${index}`}>
                        <span className={classes.factValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>

            <aside className={classes.sidebar}>
              {snapshotFacts.length > 0 && (
                <div className={classes.sidebarCard}>
                  <h3 className={classes.sidebarTitle}>{t("jobPosting.section.snapshot", "Position snapshot")}</h3>
                  <div className={classes.sidebarList}>
                    {snapshotFacts.map((entry) => (
                      <div className={classes.metaRow} key={`${entry.label}-${entry.value}`}>
                        <span className={classes.factLabel}>{entry.label}</span>
                        <span className={classes.factValue}>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(companyName || applyUrl || companyUrl) && (
                <div className={classes.sidebarCard}>
                  <h3 className={classes.sidebarTitle}>{t("jobPosting.section.company", "Hiring organization")}</h3>
                  {companyName && (
                    <div className={classes.metaRow}>
                      <span className={classes.factLabel}>{t("jobPosting.meta.company", "Hiring company")}</span>
                      <span className={classes.factValue}>{companyName}</span>
                    </div>
                  )}
                  {companyUrl && (
                    <a href={companyUrl} target="_blank" rel="noopener noreferrer" className={classes.ctaSecondary}>
                      {t("jobPosting.cta.companySite", "View company site")} →
                    </a>
                  )}
                  {applyUrl && (
                    <>
                      <div className={classes.divider} />
                      <a
                        href={applyUrl}
                        target={applyLink.target}
                        rel={applyLink.rel}
                        className={classes.ctaPrimary}
                      >
                        {t("jobPosting.section.apply", "Submit application")} →
                      </a>
                    </>
                  )}
                </div>
              )}
            </aside>
          </div>
        </section>
      </>
    );
  },
);
