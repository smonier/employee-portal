import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const formatDateTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:event",
    name: "default",
    displayName: "Event Card",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const start = formatDateTime(props["jemp:start"]);
    const end = formatDateTime(props["jemp:end"]);

    return (
      <article className={classes.card}>
        <h2 className={classes.title}>{props["jcr:title"]}</h2>
        {props["jemp:summary"] && <p className={classes.summary}>{props["jemp:summary"]}</p>}
        {(start || end || props["jemp:location"]) && (
          <div className={classes.meta}>
            {start && (
              <span>
                {t("jemp.label.starts")}: {start}
              </span>
            )}
            {end && (
              <span>
                {t("jemp.label.ends")}: {end}
              </span>
            )}
            {props["jemp:location"] && (
              <span>
                {t("jemp.label.location")}: {props["jemp:location"]}
              </span>
            )}
          </div>
        )}
        {(props["jemp:onlineUrl"] || props["jemp:requiresRSVP"]) && (
          <div className={classes.actions}>
            {props["jemp:onlineUrl"] && (
              <a className={classes.link} href={props["jemp:onlineUrl"]}>
                {t("jemp.label.joinOnline")}
              </a>
            )}
            {props["jemp:requiresRSVP"] && (
              <span className={classes.rsvp}>{t("jemp.label.rsvpRequired")}</span>
            )}
          </div>
        )}
      </article>
    );
  },
);
