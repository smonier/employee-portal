import {
  buildEndpointUrl,
  buildModuleFileUrl,
  Island,
  jahiaComponent,
} from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import LoginClient from "./Login.client";
import { rawPersona } from "./persona";

type Props = {
  "j:displayRememberMeButton"?: boolean;
};

jahiaComponent(
  {
    nodeType: "jempnt:login",
    name: "default",
    displayName: "Login",
    componentType: "view",
    properties: {
      "cache.perUser": "true",
    },
  },
  ({ "j:displayRememberMeButton": displayRememberMe }: Props, { renderContext }) => {
    const context = renderContext as RenderContext;
    const isLoggedIn = context.isLoggedIn();
    const user = typeof context.getUser === "function" ? context.getUser() : null;
    const userWithName = user as unknown as { getName?: () => string } | null;
    const userHydrated =
      userWithName && typeof userWithName.getName === "function"
        ? userWithName.getName()
        : undefined;

    const urlGenerator = context.getURLGenerator();
    const urls = {
      liveUrl: buildEndpointUrl(urlGenerator.getLive()),
      previewUrl: buildEndpointUrl(urlGenerator.getPreview()),
      editUrl: buildEndpointUrl(urlGenerator.getEdit()),
      gqlUrl: buildEndpointUrl("/modules/graphql"),
      loginUrl: buildEndpointUrl(urlGenerator.getLogin()),
      logoutUrl: buildEndpointUrl(urlGenerator.getLogout()),
    };

    const persona = rawPersona.map((p) => ({
      ...p,
      userinfo: {
        ...p.userinfo,
        avatar: {
          image: {
            ...p.userinfo.avatar.image,
            url: buildModuleFileUrl(p.userinfo.avatar.image.url),
          },
          video: {
            ...p.userinfo.avatar.video,
            url: buildModuleFileUrl(p.userinfo.avatar.video.url),
          },
        },
      },
    }));

    const mode = typeof context.getMode === "function" ? context.getMode() : "live";
    const mainPath = context.getMainResource().getNode().getPath();

    return (
      <Island
        component={LoginClient}
        props={{
          isLoggedIn,
          userHydrated,
          urls,
          mode,
          nodePath: mainPath,
          isShowRememberMe: displayRememberMe ?? true,
          siteKey: context.getSite().getSiteKey(),
          persona,
        }}
      />
    );
  },
);
