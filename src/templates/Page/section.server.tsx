import { Area, AbsoluteArea, jahiaComponent, Render } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
import styles from "./home.module.css";

import type { RenderContext } from "org.jahia.services.render";

type BasicPageProps = {
  "jcr:title": string;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "section",
    displayName: "Section",
  },
  ({ "jcr:title": title }: BasicPageProps, { renderContext }) => (
    <Layout title={title}>
      <Render content={{ nodeType: "jempnt:navBar" }} />
      <Area name="header" allowedNodeTypes={["jempnt:hero"]} numberOfItems={1} />
      <main>
        <section id="content" className={styles.contentZone}>
          <div className={styles.container}>
            <Area name="main" />
          </div>
        </section>
      </main>
      <AbsoluteArea
        name="footer"
        parent={(renderContext as RenderContext).getSite()}
        nodeType="jempnt:footer"
      />
    </Layout>
  ),
);
