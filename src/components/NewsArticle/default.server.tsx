import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const renderBody = (body?: string) => {
  if (!body) return null;
  return <div className={classes.body} dangerouslySetInnerHTML={{ __html: body }} />;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:news",
    name: "default",
    displayName: "News Article",
  },
  (rawProps) => {
    const props = rawProps as unknown as Props;
    const heroImage = props["jemp:heroImage"];

    return (
      <article className={classes.article}>
        {heroImage && <img className={classes.hero} src={buildNodeUrl(heroImage)} alt="" />}
        <h1 className={classes.title}>{props["jcr:title"]}</h1>
        {props["jemp:summary"] && <p className={classes.summary}>{props["jemp:summary"]}</p>}
        {renderBody(props["jemp:body"])}
      </article>
    );
  },
);
