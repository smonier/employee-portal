import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./card.module.css";

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:event",
    name: "cm",
    displayName: "Event - Content Manager Preview",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const startDate = formatDate(props["jemp:start"]);
    const startTime = formatTime(props["jemp:start"]);

    return (
      <article className={classes.card}>
        <div className={classes.link}>
          <div className={classes.content}>
            {startDate && (
              <div className={classes.dateBox}>
                <span className={classes.date}>{startDate}</span>
                {startTime && <span className={classes.time}>{startTime}</span>}
              </div>
            )}
            <div className={classes.details}>
              <h3 className={classes.title}>{props["jcr:title"]}</h3>
              {props["jemp:location"] && (
                <p className={classes.location}>📍 {props["jemp:location"]}</p>
              )}
              {props["jemp:summary"] && <p className={classes.summary}>{props["jemp:summary"]}</p>}
              <span className={classes.readMore}>{t("jemp.label.viewDetails")} →</span>
            </div>
          </div>
        </div>
      </article>
    );
  },
);
