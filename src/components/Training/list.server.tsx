import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./list.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { formatDateTime, resolveLocale } from "./utils";

const resolveDetailUrl = (
  node: JCRNodeWrapper | undefined,
  fallback?: string,
) => {
  if (node && typeof node.getIdentifier === "function") {
    return buildNodeUrl(node);
  }
  return fallback;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:training",
    name: "list",
    displayName: "Training List Item",
  },
  (rawProps: TrainingProps, { renderContext, currentNode }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const provider = props["jemp:providerName"];
    const delivery = props["jemp:deliveryMode"];
    const startDate = formatDateTime(props["jemp:startDate"], locale);
    const ctaUrl = props["jemp:ctaUrl"] || props["jemp:providerUrl"];
    const detailUrl = resolveDetailUrl(currentNode as JCRNodeWrapper | undefined, ctaUrl);
    const viewDetailsLabel = t("training.cta.viewDetails", "View details");

    return (
      <article className={classes.item} itemScope itemType="https://schema.org/TrainingEvent">
        <div className={classes.meta}>
          <span className={classes.label}>{t("training.label", "Training")}</span>
          {startDate && <span>{startDate}</span>}
          {delivery && <span>{delivery}</span>}
        </div>

        <h3 className={classes.title} itemProp="name">
          {detailUrl ? (
            <a
              className={classes.titleLink}
              href={detailUrl}
              target={detailUrl === ctaUrl ? "_blank" : "_self"}
              rel={detailUrl === ctaUrl ? "noopener noreferrer" : undefined}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {summary && (
          <p className={classes.summary} itemProp="description">
            {summary}
          </p>
        )}

        <div className={classes.footer}>
          {provider && <span className={classes.provider}>{provider}</span>}
          {detailUrl && (
            <a
              className={classes.link}
              href={detailUrl}
              target={detailUrl === ctaUrl ? "_blank" : "_self"}
              rel={detailUrl === ctaUrl ? "noopener noreferrer" : undefined}
            >
              {viewDetailsLabel} →
            </a>
          )}
        </div>
      </article>
    );
  },
);
