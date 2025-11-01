import { jahiaComponent, getNodeProps } from "@jahia/javascript-modules-library";
import type { Resource } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";
import classes from "./component.module.css";
import {
  normaliseLocaleCode,
  resolveImageUrl,
  sanitiseRichText,
  formatMenuDateLabel,
  normaliseMenuDate,
  resolveLocalizedString,
  resolveLocalizedStringList,
} from "../CafeteriaMenu/utils";

type Props = {
  "jcr:title"?: string;
  "jemp:menuDate"?: string;
  "jemp:isVegan"?: string | boolean;
  "jemp:allergens"?: string | string[];
  "jemp:dishes"?: string;
  "jemp:calories"?: string;
  "jemp:image"?: unknown;
};

const toBoolean = (value?: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

const resolveAllergens = (value: unknown, locale: string) =>
  resolveLocalizedStringList(value, locale);

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:cafeteriaMenuItem",
    name: "fullPage",
    displayName: "Cafeteria Menu Item - Full Page",
  },
  (
    rawProps: Props,
    {
      currentNode,
      currentResource,
    }: {
      currentNode?: JCRNodeWrapper;
      currentResource: Resource;
    },
  ) => {
    const node = (currentNode ||
      (rawProps as unknown as { node?: JCRNodeWrapper }).node) as JCRNodeWrapper | undefined;

    const props = node
      ? getNodeProps<Props>(node, [
          "jcr:title",
          "jemp:menuDate",
          "jemp:isVegan",
          "jemp:allergens",
          "jemp:dishes",
          "jemp:calories",
          "jemp:image",
        ])
      : rawProps;

    const locale = normaliseLocaleCode(currentResource.getLocale().getLanguage()) ?? "en";
    const title = resolveLocalizedString(props["jcr:title"], locale) || props["jcr:title"];
    const rawDate = normaliseMenuDate(props["jemp:menuDate"]);
    const dateLabel = formatMenuDateLabel(rawDate, locale);
    const isVegan = toBoolean(props["jemp:isVegan"]);
    const allergens = resolveAllergens(props["jemp:allergens"], locale);
    const descriptionSource = resolveLocalizedString(props["jemp:dishes"], locale);
    const description = sanitiseRichText(descriptionSource);
    const calories = resolveLocalizedString(props["jemp:calories"], locale) || props["jemp:calories"];
    const imageUrl = resolveImageUrl(props["jemp:image"]);

    return (
      <article className={classes.fullPage}>
        <header className={classes.hero}>
          {imageUrl && <img src={imageUrl} alt={title ?? ""} />}
          <div className={classes.heroOverlay}>
            <div className={classes.heroContent}>
              <div className={`${classes.badgeRow} ${classes.badgeRowCenter}`}>
                {dateLabel && <span className={classes.badge}>{dateLabel}</span>}
                {calories && <span className={classes.badge}>{calories}</span>}
                {isVegan && (
                  <span className={`${classes.badge} ${classes.badgeVegan}`}>
                    {t("cafeteriaMenu.vegan", "Vegan")}
                  </span>
                )}
              </div>
              <h1 className={classes.heroTitle}>{title}</h1>
            </div>
          </div>
        </header>

        <div className={classes.bodyShell}>
          {description && (
            <div className={classes.body} dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {allergens && allergens.length > 0 && (
            <div className={classes.allergens}>
              <h2>{t("cafeteriaMenuItem.allergens", "Allergens")}</h2>
              <div className={classes.chips}>
                {allergens.map((allergen) => (
                  <span key={allergen} className={classes.chip}>
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  },
);
