import { jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./fullPage.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { buildJsonLd, formatDateTime, resolveImageUrl, resolveLocale } from "./utils";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:training",
    name: "fullPage",
    displayName: "Training Full Page",
  },
  (rawProps: TrainingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const description = props["jemp:description"];
    const providerName = props["jemp:providerName"];
    const providerUrl = props["jemp:providerUrl"];
    const ctaUrl = props["jemp:ctaUrl"] || providerUrl;
    const imageUrl = resolveImageUrl(props["jemp:heroImage"], renderContext as RenderContext);
    const jsonLd = buildJsonLd(props, locale, ctaUrl, imageUrl);
    const schedule = [
      {
        label: t("training.meta.start", "Starts"),
        value: formatDateTime(props["jemp:startDate"], locale),
      },
      {
        label: t("training.meta.end", "Ends"),
        value: formatDateTime(props["jemp:endDate"], locale),
      },
      {
        label: t("training.meta.duration", "Duration"),
        value: props["jemp:duration"],
      },
    ].filter((entry) => entry.value);

    const essentials = [
      {
        label: t("training.meta.delivery", "Delivery mode"),
        value: props["jemp:deliveryMode"],
      },
      {
        label: t("training.meta.location", "Location"),
        value: props["jemp:location"],
      },
      {
        label: t("training.meta.cost", "Cost"),
        value: props["jemp:cost"],
      },
    ].filter((entry) => entry.value);

    const profile = [
      {
        label: t("training.meta.skillLevel", "Skill level"),
        value: props["jemp:skillLevel"],
      },
      {
        label: t("training.meta.audience", "Audience"),
        value: props["jemp:audience"],
      },
      {
        label: t("training.meta.format", "Format"),
        value: props["jemp:format"],
      },
    ].filter((entry) => entry.value);

    return (
      <>
        <section className={classes.hero} itemScope itemType="https://schema.org/TrainingEvent">
          {imageUrl && <img src={imageUrl} alt="" className={classes.heroImage} />}
          <div className={classes.heroContent}>
            <div className={classes.heroMeta}>
              <span className={classes.heroChip}>{t("training.label", "Training")}</span>
              {props["jemp:format"] && <span className={classes.heroChip}>{props["jemp:format"]}</span>}
              {props["jemp:deliveryMode"] && <span className={classes.heroChip}>{props["jemp:deliveryMode"]}</span>}
            </div>
            <h1 className={classes.heroTitle} itemProp="name">
              {title}
            </h1>
            {summary && (
              <p className={classes.heroSummary} itemProp="description">
                {summary}
              </p>
            )}
            <div className={classes.ctaRow}>
              {ctaUrl && (
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className={classes.primaryCta}>
                  {t("training.cta.register", "Register now")} →
                </a>
              )}
              {providerUrl && (
                <a href={providerUrl} target="_blank" rel="noopener noreferrer" className={classes.secondaryCta}>
                  {t("training.meta.provider", "Provided by")} {providerName || providerUrl}
                </a>
              )}
            </div>
          </div>
          <script
            type="application/ld+json"
            className={classes.schemaScript}
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
          {ctaUrl && <meta itemProp="url" content={ctaUrl} />}
          {imageUrl && <meta itemProp="image" content={imageUrl} />}
        </section>

        <section className={classes.page}>
          {(schedule.length > 0 || essentials.length > 0) && (
            <div className={classes.highlightGrid}>
              {schedule.map((entry) => (
                <div className={classes.highlightCard} key={entry.label}>
                  <span className={classes.highlightLabel}>{entry.label}</span>
                  <span className={classes.highlightValue}>{entry.value}</span>
                </div>
              ))}
              {essentials.map((entry) => (
                <div className={classes.highlightCardAlt} key={entry.label}>
                  <span className={classes.highlightLabel}>{entry.label}</span>
                  <span className={classes.highlightValue}>{entry.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className={classes.infoPanels}>
            {description && (
              <div className={classes.panel}>
                <h2 className={classes.sectionTitle}>{t("training.section.overview", "Overview")}</h2>
                <div
                  className={classes.sectionContent}
                  dangerouslySetInnerHTML={{ __html: description }}
                  itemProp="description"
                />
              </div>
            )}

            {(profile.length > 0 || providerName || ctaUrl) && (
              <aside className={classes.panel}>
                <h2 className={classes.sectionTitle}>{t("training.section.details", "Training details")}</h2>
                {profile.length > 0 && (
                  <ul className={classes.factList}>
                    {profile.map((entry) => (
                      <li key={entry.label} className={classes.factItem}>
                        <span className={classes.factLabel}>{entry.label}</span>
                        <span className={classes.factValue}>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {providerName && (
                  <div className={classes.providerBlock}>
                    <span className={classes.factLabel}>{t("training.section.provider", "About the provider")}</span>
                    {providerUrl ? (
                      <a href={providerUrl} target="_blank" rel="noopener noreferrer" className={classes.providerLink}>
                        {providerName}
                      </a>
                    ) : (
                      <span className={classes.factValue}>{providerName}</span>
                    )}
                  </div>
                )}

                {ctaUrl && (
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className={classes.secondaryCta}>
                    {t("training.cta.register", "Register now")} →
                  </a>
                )}
              </aside>
            )}
          </div>
        </section>
      </>
    );
  },
);
