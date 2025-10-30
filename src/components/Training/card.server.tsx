import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./card.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { formatDateTime, resolveImageUrl, resolveLocale } from "./utils";
import type { JCRNodeWrapper } from "org.jahia.services.content";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:training",
    name: "card",
    displayName: "Training Card",
  },
  (rawProps: TrainingProps, { renderContext, currentNode }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const provider = props["jemp:providerName"];
    const ctaUrl = props["jemp:ctaUrl"] || props["jemp:providerUrl"];
    const detailUrl =
      (currentNode as JCRNodeWrapper | undefined)?.getPath instanceof Function
        ? buildNodeUrl(currentNode as JCRNodeWrapper)
        : ctaUrl;
    const imageUrl = resolveImageUrl(props["jemp:heroImage"], renderContext as RenderContext);
    const start = formatDateTime(props["jemp:startDate"], locale);
    const delivery = props["jemp:deliveryMode"];
    const location = props["jemp:location"];
    const viewDetailsLabel = t("training.cta.viewDetails", "View details");

    const content = (
      <>
        {imageUrl && (
          <div className={classes.imageWrapper}>
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        )}
        <div className={classes.body}>
          <h3 className={classes.title}>{title}</h3>
          <div className={classes.meta}>
            {start && <span>{start}</span>}
            {delivery && <span>{delivery}</span>}
            {location && <span>{location}</span>}
            {!location && provider && <span>{provider}</span>}
          </div>
          {summary && <p className={classes.summary}>{summary}</p>}
          <div className={classes.ctaRow}>
            <span>{provider}</span>
            <span className={classes.viewMore}>
              {viewDetailsLabel} →
            </span>
          </div>
        </div>
      </>
    );

    return (
      <article className={classes.card} itemScope itemType="https://schema.org/TrainingEvent">
        {detailUrl ? (
          <a
            className={classes.link}
            href={detailUrl}
            target={detailUrl === ctaUrl ? "_blank" : "_self"}
            rel={detailUrl === ctaUrl ? "noopener noreferrer" : undefined}
          >
            {content}
          </a>
        ) : (
          <div className={classes.link}>{content}</div>
        )}
        {detailUrl && <meta itemProp="url" content={detailUrl} />}
        {imageUrl && <meta itemProp="image" content={imageUrl} />}
      </article>
    );
  },
);
