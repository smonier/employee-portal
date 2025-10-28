import { Area, jahiaComponent, Render } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
type BasicPageProps = {
  "jcr:title": string;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "login",
    displayName: "Login Page",
  },
  ({ "jcr:title": title }: BasicPageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "jempnt:navBar" }} />
      <Area name="header" allowedNodeTypes={["jempnt:hero"]} numberOfItems={1} />

      <Area name="main" allowedNodeTypes={["jempnt:login"]} numberOfItems={1} />

    </Layout>
  ),
);
