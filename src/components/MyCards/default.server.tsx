import { buildNodeUrl, getChildNodes, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";

/** Get all child cards */
const getChildCards = (node: JCRNodeWrapper) =>
  getChildNodes(node, -1, 0, (child) => child.isNodeType("jempnt:dashboardCard"));

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:myCards",
    name: "default",
    displayName: "My Cards",
  },
  ({ node }: { node: JCRNodeWrapper }) => {
    const cards = getChildCards(node);

    if (cards.length === 0) {
      return <div className={classes.myCards}></div>;
    }

    return (
      <section className={classes.myCards}>
        <h2 className={classes.title}>My Dashboard</h2>
        <div className={classes.cardGrid}>
          {cards.map((card) => {
            const title = card.getProperty("jcr:title").getString();
            const type = card.hasProperty("jemp:type")
              ? card.getProperty("jemp:type").getString()
              : "info";
            const deeplink = card.hasProperty("jemp:deeplink")
              ? card.getProperty("jemp:deeplink").getString()
              : null;
            const value = card.hasProperty("jemp:value")
              ? card.getProperty("jemp:value").getString()
              : null;
            const icon = card.hasProperty("jemp:icon")
              ? card.getProperty("jemp:icon").getString()
              : null;

            const CardWrapper = deeplink ? "a" : "div";
            const cardProps = deeplink ? { href: deeplink } : {};

            return (
              <CardWrapper
                key={card.getPath()}
                className={`${classes.card} ${classes[`card--${type}`]}`}
                {...cardProps}
              >
                {icon && (
                  <div className={classes.cardIcon}>
                    <span>{icon}</span>
                  </div>
                )}
                <div className={classes.cardContent}>
                  <h3 className={classes.cardTitle}>{title}</h3>
                  {value && <div className={classes.cardValue}>{value}</div>}
                </div>
              </CardWrapper>
            );
          })}
        </div>
      </section>
    );
  },
);
