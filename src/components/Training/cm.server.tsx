import { jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./card.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { formatDateTime, resolveImageUrl, resolveLocale } from "./utils";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:training",
    name: "cm",
    displayName: "Training - Content Manager Preview",
  },
  (rawProps: TrainingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const provider = props["jemp:providerName"];
    const imageUrl = resolveImageUrl(props["jemp:heroImage"], renderContext as RenderContext);
    const start = formatDateTime(props["jemp:startDate"], locale);
    const delivery = props["jemp:deliveryMode"];
    const location = props["jemp:location"];

    return (
      <article className={classes.card}>
        <div className={classes.link}>
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
              <span>{t("training.cta.viewDetails", "View details")} →</span>
            </div>
          </div>
        </div>
      </article>
    );
  },
);
