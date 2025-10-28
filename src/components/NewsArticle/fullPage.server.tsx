import { jahiaComponent } from "@jahia/javascript-modules-library";
import type { Props } from "./types.js";
import classes from "./fullPage.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:news",
    name: "fullPage",
    displayName: "News Article - Full Page",
  },
  (rawProps) => {
    const props = rawProps as unknown as Props;
    const title = props["jcr:title"];
    const summary = props["jemp:summary"];
    const body = props["jemp:body"];
    const heroImage = props["jemp:heroImage"];
    const publishDate = props["jemp:publishDate"];

    // Get image URL from the file node path
    const imageUrl = heroImage?.getPath ? `/files/default${heroImage.getPath()}` : null;
    const formattedDate = publishDate
      ? new Date(publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    return (
      <article className={classes.article}>
        {/* Hero Section */}
        {imageUrl && (
          <div className={classes.hero}>
            <div className={classes.heroOverlay} />
            <img src={imageUrl} alt={title} className={classes.heroImage} />
            <div className={classes.heroContent}>
              <div className={classes.container}>
                {formattedDate && (
                  <time className={classes.publishDate} dateTime={publishDate}>
                    {formattedDate}
                  </time>
                )}
                <h1 className={classes.title}>{title}</h1>
                {summary && <p className={classes.summary}>{summary}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className={classes.content}>
          <div className={classes.container}>
            {/* Title for articles without hero image */}
            {!imageUrl && (
              <header className={classes.header}>
                {formattedDate && (
                  <time className={classes.publishDate} dateTime={publishDate}>
                    {formattedDate}
                  </time>
                )}
                <h1 className={classes.titleNoHero}>{title}</h1>
                {summary && <p className={classes.summaryNoHero}>{summary}</p>}
              </header>
            )}

            {/* Article Body */}
            {body && <div className={classes.body} dangerouslySetInnerHTML={{ __html: body }} />}
          </div>
        </div>
      </article>
    );
  },
);
