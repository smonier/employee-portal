import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./fullPage.module.css";

const formatEffectiveDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const extractLeadParagraph = (html?: string) => {
  if (!html) return null;
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match) return null;
  const text = match[1]?.replace(/<[^>]+>/g, "").trim();
  return text || null;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:policy",
    name: "fullPage",
    displayName: "Policy Detail - Full Page",
  },
  (rawProps: Props) => {
    const title = rawProps["jcr:title"];
    const description = rawProps["jemp:description"];
    const effectiveDate = formatEffectiveDate(rawProps["jemp:effectiveDate"]);
    const uuid = rawProps["jcr:uuid"] || Math.random().toString(36).slice(2);
    const contentId = `policy-content-${uuid}`;
    const leadParagraph = extractLeadParagraph(description);

    return (
      <article className={classes.article}>
        <header className={classes.hero}>
          <span className={classes.heroAccent} aria-hidden="true" />
          <div className={classes.heroInner}>
            <span className={classes.label}>
              {t("jempnt_policy.fullPage.label", "Company Policy")}
            </span>
            <h1 className={classes.title}>{title}</h1>
            {leadParagraph && <p className={classes.lead}>{leadParagraph}</p>}
            {effectiveDate && (
              <p className={classes.date}>
                <span className={classes.dateDot} aria-hidden="true" />
                {t("jemp.label.effective", "Effective")} {effectiveDate}
              </p>
            )}
          </div>
        </header>

        <div className={classes.contentShell}>
          <section
            id={contentId}
            className={classes.bodyWrapper}
            data-empty={description ? undefined : "true"}
          >
            {description ? (
              <div className={classes.body} dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              t("jempnt_policy.fullPage.empty", "Policy content will be published soon.")
            )}
          </section>

          <aside className={classes.sidebar}>
            <div className={classes.sidebarCard}>
              <h2 className={classes.sidebarTitle}>
                {t("jempnt_policy.fullPage.sidebarTitle", "Need-to-know details")}
              </h2>
              <dl className={classes.definitionList}>
                {effectiveDate && (
                  <div className={classes.definitionItem}>
                    <dt>{t("jemp.label.effective", "Effective")}</dt>
                    <dd>{effectiveDate}</dd>
                  </div>
                )}
                <div className={classes.definitionItem}>
                  <dt>{t("jempnt_policy.fullPage.owner", "Policy Owner")}</dt>
                  <dd>{t("jempnt_policy.fullPage.ownerValue", "People & Culture Team")}</dd>
                </div>
              </dl>
              <p className={classes.sidebarNote}>
                {t(
                  "jempnt_policy.fullPage.support",
                  "Have questions about this policy? Contact your HR partner for personalized guidance.",
                )}
              </p>
              <a className={classes.sidebarButton} href={`#${contentId}`}>
                {t("jempnt_policy.fullPage.cta", "Jump to full policy")}
              </a>
              <p className={classes.sidebarHelp}>
                {t(
                  "jempnt_policy.fullPage.help",
                  "Tip: Save this page for quick access to the latest updates.",
                )}
              </p>
            </div>
          </aside>
        </div>
      </article>
    );
  },
);
