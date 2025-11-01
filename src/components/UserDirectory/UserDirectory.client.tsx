import { useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import classes from "./component.module.css";

type Props = {
  apiUrl: string;
  results: number;
};

type DirectoryUser = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  location?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const buildRequestUrl = (base: string, results: number) => {
  if (!Number.isFinite(results) || results <= 0) {
    results = 1;
  }

  try {
    const url = new URL(base);
    url.searchParams.set("results", String(results));
    return url.toString();
  } catch {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}results=${results}`;
  }
};

const pickAvatar = (input: unknown): string | undefined => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const record = input as Record<string, unknown>;
  for (const key of ["large", "medium", "thumbnail"]) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
};

const toDirectoryUser = (entry: Record<string, unknown>, fallbackIndex: number): DirectoryUser => {
  const name = entry.name as { title?: string; first?: string; last?: string } | undefined;
  const title = name?.title?.trim();
  const first = name?.first?.trim();
  const last = name?.last?.trim();
  const fullName = [title, first, last].filter((part) => part && part.length > 0).join(" ") || t("userDirectory.user.unknown", "Unknown user");

  const location = entry.location as {
    city?: string;
    state?: string;
    country?: string;
  } | undefined;
  const parts = [location?.city, location?.state, location?.country]
    .map((value) => (typeof value === "string" ? value.trim() : undefined))
    .filter(Boolean) as string[];
  const locationLabel = parts.length > 0 ? parts.join(", ") : undefined;

  const idSources = [
    (entry.login as { uuid?: string } | undefined)?.uuid,
    typeof entry.email === "string" ? entry.email : undefined,
    typeof entry.phone === "string" ? entry.phone : undefined,
    fullName,
    `user-${fallbackIndex}`,
  ];
  const identifier = idSources.find((value) => value && value.length > 0) ?? `user-${fallbackIndex}`;

  return {
    id: identifier,
    fullName,
    email: typeof entry.email === "string" ? entry.email : undefined,
    phone: typeof entry.phone === "string" ? entry.phone : undefined,
    avatar: pickAvatar(entry.picture),
    location: locationLabel,
  };
};

export default function UserDirectoryClient({ apiUrl, results }: Props) {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadUsers = async () => {
      setStatus("loading");
      setError(null);

      try {
        const requestUrl = buildRequestUrl(apiUrl, results);
        const response = await fetch(requestUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const payload = (await response.json()) as { results?: Record<string, unknown>[] } | undefined;
        if (!payload?.results || !Array.isArray(payload.results)) {
          throw new Error("Malformed response");
        }
        if (cancelled) {
          return;
        }
        const mapped = payload.results.map((entry, index) => toDirectoryUser(entry, index));
        setUsers(mapped);
        setStatus("success");
      } catch (fetchError) {
        if (cancelled || (fetchError instanceof DOMException && fetchError.name === "AbortError")) {
          return;
        }
        console.error("[UserDirectory] Failed to fetch users", fetchError);
        setError(
          t("userDirectory.status.error", "We were unable to load the directory right now. Please try again later."),
        );
        setStatus("error");
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [apiUrl, results]);

  const filteredUsers = useMemo(() => {
    if (!query) {
      return users;
    }
    const term = query.trim().toLowerCase();
    if (term.length === 0) {
      return users;
    }
    return users.filter((user) => {
      const haystack = [
        user.fullName,
        user.email,
        user.phone,
        user.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [users, query]);

  const columnsAttribute =
    filteredUsers.length === 0 && query.trim().length > 0
      ? 1
      : filteredUsers.length < 3
        ? filteredUsers.length === 0 ? 1 : 2
        : 3;

  const searchLabel = t("userDirectory.search.label", "Search colleagues");
  const searchPlaceholder = t("userDirectory.search.placeholder", "Search by name, email, or location");

  if (status === "loading" || status === "idle") {
    return (
      <div className={classes.status}>
        {t("userDirectory.status.loading", "Loading colleagues…")}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${classes.status} ${classes.statusError}`}>
        {error ??
          t("userDirectory.status.error", "We were unable to load the directory right now. Please try again later.")}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <>
        <div className={classes.controls}>
          <label className={classes.search} aria-label={searchLabel}>
            <input
              className={classes.searchInput}
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className={classes.status}>
          {t("userDirectory.status.empty", "No colleagues found.")}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={classes.controls}>
        <label className={classes.search} aria-label={searchLabel}>
          <input
            className={classes.searchInput}
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className={classes.grid} role="list" data-columns={columnsAttribute}>
      {filteredUsers.map((user) => (
        <article key={user.id} className={classes.card} role="listitem">
          {user.avatar ? (
            <img className={classes.avatar} src={user.avatar} alt={user.fullName} loading="lazy" />
          ) : (
            <div className={classes.fallbackAvatar} aria-hidden="true">
              {user.fullName
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?"}
            </div>
          )}
          <div className={classes.info}>
            <h4 className={classes.name}>{user.fullName}</h4>
            <div className={classes.meta}>
              {user.location && <span className={classes.location}>{user.location}</span>}
            </div>
            <div className={classes.contact}>
              {user.email && (
                <a className={classes.contactLink} href={`mailto:${user.email}`}>
                  {user.email}
                </a>
              )}
              {user.phone && (
                <a className={classes.contactLink} href={`tel:${user.phone}`}>
                  {user.phone}
                </a>
              )}
            </div>
          </div>
        </article>
        ))}
      </div>
    </>
  );
}
