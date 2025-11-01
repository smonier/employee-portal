import { useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import classes from "./CafeteriaMenu.client.module.css";
import type { CafeteriaMenuItem } from "./types";

const resolveLocale = (fallback?: string) => {
  const normalisedFallback = fallback?.replace(/_/g, "-");
  if (normalisedFallback) {
    return normalisedFallback;
  }

  if (typeof document !== "undefined" && document.documentElement.lang) {
    return document.documentElement.lang;
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return "en";
};

const formatDate = (value: string, locale: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return value;
  }
};

type Props = {
  items: CafeteriaMenuItem[];
  locale: string;
  weekLabel?: string;
};

export default function CafeteriaMenuClient({ items, locale, weekLabel }: Props) {
  const activeLocale = resolveLocale(locale);
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const dateA = a.menuDate ? new Date(a.menuDate).getTime() : 0;
        const dateB = b.menuDate ? new Date(b.menuDate).getTime() : 0;
        return dateA - dateB;
      }),
    [items],
  );

  const dateFilters = useMemo(() => {
    const unique = new Map<string, CafeteriaMenuItem>();
    sortedItems.forEach((item) => {
      if (item.menuDate) {
        unique.set(item.menuDate, item);
      }
    });
    return Array.from(unique.entries()).map(([key]) => ({
      key,
      label: formatDate(key, activeLocale),
    }));
  }, [sortedItems, activeLocale]);

  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    dateFilters.length > 0 ? dateFilters[0].key : null,
  );

  useEffect(() => {
    if (dateFilters.length === 0) {
      if (selectedDate !== null) {
        setSelectedDate(null);
      }
      return;
    }

    if (selectedDate === null) {
      return;
    }

    const exists = dateFilters.some((filter) => filter.key === selectedDate);
    if (!exists) {
      setSelectedDate(dateFilters[0].key);
    }
  }, [dateFilters, selectedDate]);

  const visibleItems = useMemo(() => {
    if (!selectedDate) {
      return sortedItems;
    }
    return sortedItems.filter((item) => item.menuDate === selectedDate);
  }, [sortedItems, selectedDate]);

  const allLabel = t("cafeteriaMenu.filter.all", "All days");
  const filters = [
    { key: null as string | null, label: allLabel },
    ...dateFilters.map(({ key, label }) => ({
      key,
      label: t("cafeteriaMenu.filter.date", { date: label }),
    })),
  ];

  const veganLabel = t("cafeteriaMenu.vegan", "Vegan");
  const emptyLabel = t("cafeteriaMenu.emptyState", "No cafeteria menu available for this date.");

  return (
    <div aria-label={weekLabel || undefined}>
      {filters.length > 0 && (
        <div className={classes.calendarRow}>
          {filters.map(({ key, label }) => {
            const isActive = key === null ? selectedDate === null : selectedDate === key;
            return (
            <button
              key={key ?? "all"}
              type="button"
              className={classes.calendarButton}
              data-active={isActive ? "true" : undefined}
              aria-pressed={isActive}
              onClick={() => setSelectedDate(key)}
            >
              {label}
            </button>
            );
          })}
        </div>
      )}

      {visibleItems.length > 0 ? (
        <div className={classes.grid}>
          {visibleItems.map((item) => (
            <article key={item.id} className={classes.itemCard} itemScope itemType="https://schema.org/MenuItem">
              {item.imageUrl && (
                <div className={classes.imageWrapper}>
                  <img src={item.imageUrl} alt="" loading="lazy" />
                </div>
              )}
              <div className={classes.content}>
                <header className={classes.itemHeader}>
                  <h3 className={classes.itemTitle} itemProp="name">
                    {item.title}
                  </h3>
                  <div className={classes.chipGroup}>
                    {item.menuDate && (
                      <span className={classes.chip}>{formatDate(item.menuDate, activeLocale)}</span>
                    )}
                    {item.isVegan && (
                      <span className={`${classes.chip} ${classes.chipVegan}`}>{veganLabel}</span>
                    )}
                    {item.calories && <span className={classes.chip}>{item.calories}</span>}
                  </div>
                </header>

                {item.dishes && (
                  <div
                    className={classes.dishes}
                    itemProp="description"
                    dangerouslySetInnerHTML={{ __html: item.dishes }}
                  />
                )}

                {item.allergens && item.allergens.length > 0 && (
                  <div className={classes.chipGroup}>
                    {item.allergens.map((allergen) => (
                      <span key={allergen} className={classes.chip}>
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={classes.emptyState}>{emptyLabel}</div>
      )}
    </div>
  );
}
