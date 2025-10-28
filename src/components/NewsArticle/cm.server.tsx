import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./card.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:news",
    name: "cm",
    displayName: "News Article - Content Manager Preview",
  },
  (rawProps) => {
    const props = rawProps as unknown as Props;
    const heroImage = props["jemp:heroImage"];
    const publishDate = props["jemp:publishDate"]
      ? new Date(props["jemp:publishDate"]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

    return (
      <article className={classes.card}>
        <div className={classes.link}>
          {heroImage && (
            <div className={classes.imageWrapper}>
              <img className={classes.image} src={buildNodeUrl(heroImage)} alt="" />
            </div>
          )}
          <div className={classes.content}>
            {publishDate && <time className={classes.date}>{publishDate}</time>}
            <h3 className={classes.title}>{props["jcr:title"]}</h3>
            {props["jemp:summary"] && <p className={classes.summary}>{props["jemp:summary"]}</p>}
            <span className={classes.readMore}>{t("jemp.label.readMore")} →</span>
          </div>
        </div>
      </article>
    );
  },
);
