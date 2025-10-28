import type { RenderContext, Resource } from "org.jahia.services.render";

export type Props = {
  notice: string;
  renderContext: RenderContext;
  currentResource: Resource;
};
