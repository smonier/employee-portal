import { Area, jahiaComponent, Render } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
import styles from "./home.module.css";

type BasicPageProps = {
  "jcr:title": string;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "apps",
    displayName: "Apps Page full width with Hero",
  },
  ({ "jcr:title": title }: BasicPageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "jempnt:navBar" }} />
      <Area name="header" allowedNodeTypes={["jempnt:hero"]} numberOfItems={1} />
      <Area name="main" />
    </Layout>
  ),
);
