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
    name: "basic",
    displayName: "Basic page",
  },
  ({ "jcr:title": title }: BasicPageProps, { renderContext }) => (
    <Layout title={title}>
      <Render content={{ nodeType: "jempnt:navBar" }} />
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
