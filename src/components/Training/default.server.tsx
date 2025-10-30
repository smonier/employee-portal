import { jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./component.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { buildJsonLd, formatDateTime, resolveImageUrl, resolveLocale } from "./utils";

const metaEntries = (
  props: TrainingProps,
  locale: string,
): Array<{ label: string; value?: string }> => {
  const start = formatDateTime(props["jemp:startDate"], locale);
  const end = formatDateTime(props["jemp:endDate"], locale);

  return [
    { label: t("training.meta.start", "Starts"), value: start },
    { label: t("training.meta.end", "Ends"), value: end },
    { label: t("training.meta.duration", "Duration"), value: props["jemp:duration"] },
    { label: t("training.meta.delivery", "Delivery mode"), value: props["jemp:deliveryMode"] },
    { label: t("training.meta.location", "Location"), value: props["jemp:location"] },
    { label: t("training.meta.skillLevel", "Skill level"), value: props["jemp:skillLevel"] },
    { label: t("training.meta.audience", "Audience"), value: props["jemp:audience"] },
    { label: t("training.meta.format", "Format"), value: props["jemp:format"] },
    { label: t("training.meta.cost", "Cost"), value: props["jemp:cost"] },
  ].filter((entry) => entry.value);
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:training",
    name: "default",
    displayName: "Training",
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
    const meta = metaEntries(props, locale);
    const jsonLd = buildJsonLd(props, locale, ctaUrl, imageUrl);
    const hasProvider = providerName || providerUrl;
    const registerLabel = t("training.cta.register", "Register now");

    return (
      <article className={classes.root} itemScope itemType="https://schema.org/TrainingEvent">
        <header className={classes.header}>
          <div className={classes.metaBar}>
            <span className={classes.chip}>{t("training.label", "Training")}</span>
            {props["jemp:format"] && <span className={classes.chip}>{props["jemp:format"]}</span>}
          </div>
          <h2 className={classes.title} itemProp="name">
            {title}
          </h2>
          {summary && (
            <p className={classes.summary} itemProp="description">
              {summary}
            </p>
          )}
        </header>

        {meta.length > 0 && (
          <div className={classes.metaGrid}>
            {meta.map((entry) => (
              <div className={classes.metaItem} key={entry.label}>
                <span className={classes.metaLabel}>{entry.label}</span>
                <span className={classes.metaValue}>{entry.value}</span>
              </div>
            ))}
          </div>
        )}

        {description && (
          <div
            className={classes.description}
            dangerouslySetInnerHTML={{ __html: description }}
            itemProp="description"
          />
        )}

        <div className={classes.ctaRow}>
          {ctaUrl && (
            <a className={classes.cta} href={ctaUrl} target="_blank" rel="noopener noreferrer">
              {registerLabel}
            </a>
          )}
          {hasProvider && (
            <span className={classes.metaLabel}>
              {t("training.meta.provider", "Provided by")}{" "}
              {providerUrl ? (
                <a href={providerUrl} className={classes.providerLink} target="_blank" rel="noopener noreferrer">
                  {providerName || providerUrl}
                </a>
              ) : (
                <span className={classes.metaValue}>{providerName}</span>
              )}
            </span>
          )}
        </div>

        <script
          type="application/ld+json"
          className={classes.schemaScript}
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />

        {imageUrl && <meta itemProp="image" content={imageUrl} />}
        {ctaUrl && <meta itemProp="url" content={ctaUrl} />}
      </article>
    );
  },
);
