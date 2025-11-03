import type { JSX, ReactNode } from "react";
import {
  AbsoluteArea,
  AddResources,
  buildModuleFileUrl,
  getNodeProps,
  useServerContext,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";

import "modern-normalize/modern-normalize.css";
import "./global.css";

interface LayoutProps {
  title?: string;
  head?: ReactNode;
  children: ReactNode;
}

export const Layout = ({ title, head, children }: LayoutProps): JSX.Element => {
  const { currentResource, renderContext } = useServerContext();
  const lang = currentResource?.getLocale().getLanguage() ?? "en";
  const site = renderContext?.getSite();

  return (
    <html lang={lang}>
      <HtmlHead title={title}>{head}</HtmlHead>
      <body>
        {children}
        {site && <AbsoluteArea name="footer" parent={site} nodeType="jempnt:footer" />}
      </body>
    </html>
  );
};

const HtmlHead = ({ title, children }: { title?: string; children?: ReactNode }): JSX.Element => (
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SeoMetaTags fallbackTitle={title} />
    <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
    {children}
  </head>
);

interface SeoMetaTagsProps {
  "jcr:title"?: string;
  "jcr:description"?: string;
  openGraphImage?: JCRNodeWrapper;
  seoKeywords?: string[];
}

const SeoMetaTags = ({ fallbackTitle }: { fallbackTitle?: string }): JSX.Element | null => {
  const { currentNode, currentResource, renderContext } = useServerContext();

  if (!currentNode || !currentResource || !renderContext) {
    return fallbackTitle ? <title>{fallbackTitle}</title> : null;
  }

  const isDisplayableNodeType =
    currentNode.isNodeType("jnt:page") || currentNode.isNodeType("jmix:mainResource");

  if (!isDisplayableNodeType) {
    return fallbackTitle ? <title>{fallbackTitle}</title> : null;
  }

  const {
    "jcr:title": seoTitle,
    "jcr:description": seoDescription,
    openGraphImage,
    seoKeywords,
  }: SeoMetaTagsProps = getNodeProps(currentNode, [
    "jcr:title",
    "jcr:description",
    "openGraphImage",
    "seoKeywords",
  ]) as SeoMetaTagsProps;

  const locale = currentResource.getLocale().getLanguage();
  const request = renderContext.getRequest();
  const absOgImageUrl = openGraphImage?.getAbsoluteUrl(request);
  const site = renderContext.getSite();
  let openGraphImageSizes: { "j:width"?: number; "j:height"?: number } = {};

  if (openGraphImage) {
    openGraphImageSizes = getNodeProps(openGraphImage, ["j:width", "j:height"]) as {
      "j:width"?: number;
      "j:height"?: number;
    };
  }

  return (
    <>
      {seoTitle ? (
        <>
          <title>{seoTitle}</title>
          <meta property="og:title" content={seoTitle} />
        </>
      ) : (
        fallbackTitle && <title>{fallbackTitle}</title>
      )}
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content="website" />
      {seoDescription && (
        <>
          <meta property="og:description" content={seoDescription} />
          <meta name="description" content={seoDescription} />
        </>
      )}
      <meta property="og:url" content={currentNode.getAbsoluteUrl(request)} />
      {site && <meta property="og:site_name" content={site.getTitle()} />}
      {Boolean(seoKeywords?.length) && <meta name="keywords" content={seoKeywords!.join(",")} />}
      {absOgImageUrl && (
        <>
          <meta property="og:image" content={absOgImageUrl} />
          {openGraphImageSizes["j:width"] && (
            <meta property="og:image:width" content={`${openGraphImageSizes["j:width"]}px`} />
          )}
          {openGraphImageSizes["j:height"] && (
            <meta property="og:image:height" content={`${openGraphImageSizes["j:height"]}px`} />
          )}
        </>
      )}
    </>
  );
};
