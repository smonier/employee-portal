import { useEffect, useState, type FC, type ReactNode } from "react";
import { t } from "i18next";
import classes from "./component.module.css";

interface UnomiProfile {
  email?: string;
  firstName?: string;
  jobTitle?: string;
  lastName?: string;
  lastVisit?: string;
  profilePictureUrl?: string;
  company?: string;
}

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

// Helper to wait for window.wem to be loaded
const waitForWem = (): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).wem) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

// Fetch profile properties from Unomi
const getProfileProps = async (
  sessionId: string,
  properties: string[],
): Promise<Record<string, any> | null> => {
  if (!sessionId) {
    console.error("[getProfileProps] No session ID provided.");
    return null;
  }

  const contextServerPublicUrl = (window as any).digitalData?.contextServerPublicUrl;
  if (!contextServerPublicUrl) {
    console.error("[getProfileProps] Context server URL is missing.");
    return null;
  }

  const body = {
    requiredProfileProperties: properties,
    sessionId,
    source: {
      itemId: (window as any).digitalData?.page?.pageInfo?.pageID || "unknown",
      itemType: "page",
      scope: (window as any).digitalData?.scope || "unknown",
    },
  };

  try {
    const response = await fetch(`${contextServerPublicUrl}/context.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "allow-redirects": "false",
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data?.profileProperties) {
      return data.profileProperties;
    }

    console.warn("[getProfileProps] No profile properties found.");
    return null;
  } catch (error) {
    console.error("[getProfileProps] Error fetching profile properties:", error);
    return null;
  }
};

type CardProps = {
  title?: string;
  name?: string;
};

export const UnomiProfileCard: FC<CardProps> = ({ title, name }) => {
  const [profile, setProfile] = useState<UnomiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  const renderField = (value: string | undefined, labelKey: string, fallback: string) => {
    if (!value) return null;
    return (
      <div className={classes.infoRow}>
        <span className={classes.infoLabel}>{`${translate(labelKey, fallback)}:`}</span>
        <span className={classes.infoValue}>{value}</span>
      </div>
    );
  };

  const renderMessage = (message: string) => (
    <div className={classes.infoSection}>
      <div className={classes.infoRow}>
        <span className={classes.infoValue}>{message}</span>
      </div>
    </div>
  );

  useEffect(() => {
    console.log("[UnomiProfileCard] Component mounted");

    const fetchContext = async () => {
      try {
        console.log("[UnomiProfileCard] === Starting context fetch ===");

        // Use jExperience proxy - hardcode the site key for now
        const siteKey = "empportal";
        const contextUrl = `/modules/jexperience/proxy/${siteKey}/context.json`;

        console.log("[UnomiProfileCard] Site key:", siteKey);
        console.log("[UnomiProfileCard] jExperience proxy URL:", contextUrl);

        const requestBody = {
          requiredProfileProperties: [
            "email",
            "firstName",
            "jobTitle",
            "lastName",
            "lastVisit",
            "profilePictureUrl",
            "company",
          ],
          source: {
            itemId: window.location.pathname,
            itemType: "page",
            scope: siteKey,
          },
        };
        console.log("[UnomiProfileCard] Request body:", JSON.stringify(requestBody, null, 2));

        console.log("[UnomiProfileCard] Sending POST request...");
        const response = await fetch(contextUrl, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("[UnomiProfileCard] Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[UnomiProfileCard] Error response:", errorText);
          throw new Error(`Failed to fetch context.json: ${response.status} - ${errorText}`);
        }

        const context = await response.json();
        console.log("[UnomiProfileCard] === Full context response ===");
        console.log(JSON.stringify(context, null, 2));

        // Extract profile data from the context - try multiple paths
        console.log("[UnomiProfileCard] Looking for profile data...");
        console.log("[UnomiProfileCard] context.profileProperties:", context?.profileProperties);
        console.log("[UnomiProfileCard] context.profileId:", context?.profileId);
        console.log("[UnomiProfileCard] Available keys:", Object.keys(context || {}));

        const profileData = context?.profileProperties;

        if (profileData) {
          console.log("[UnomiProfileCard] ✓ Profile data found:", profileData);
          setProfile(profileData);
        } else {
          console.warn("[UnomiProfileCard] ✗ No profile data in profileProperties");
          setError(`No profile data found. Context keys: ${Object.keys(context || {}).join(", ")}`);
        }
      } catch (err: any) {
        console.error("[UnomiProfileCard] ✗ Error occurred:", err);
        console.error("[UnomiProfileCard] Error stack:", err.stack);
        setError(err.message || "Unknown error");
      } finally {
        console.log("[UnomiProfileCard] Fetch completed, loading = false");
        setLoading(false);
      }
    };

    fetchContext();
  }, []);

  console.log(
    "[UnomiProfileCard] Render - loading:",
    loading,
    "error:",
    error,
    "profile:",
    profile,
  );

  let infoContent: ReactNode;
  if (loading) {
    console.log("[UnomiProfileCard] Rendering: Loading state");
    infoContent = renderMessage(translate("jemp.label.loading", "Loading profile..."));
  } else if (error) {
    console.log("[UnomiProfileCard] Rendering: Error state -", error);
    infoContent = renderMessage(error);
  } else if (!profile) {
    console.log("[UnomiProfileCard] Rendering: No profile state");
    infoContent = renderMessage(translate("jemp.label.noProfile", "No profile found"));
  } else {
    console.log("[UnomiProfileCard] Rendering: Profile card with data");
    const displayName =
      profile.firstName || profile.lastName
        ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
        : name;

    infoContent = (
      <div className={classes.infoSection}>
        {renderField(displayName, "jemp.label.name", "Name")}
        {renderField(profile.email, "jemp.label.email", "Email")}
        {renderField(profile.jobTitle, "jemp.label.jobTitle", "Job Title")}
        {renderField(profile.company, "jemp.label.company", "Company")}
        {profile.lastVisit &&
          renderField(formatDate(profile.lastVisit), "jemp.label.lastVisit", "Last Visit")}
      </div>
    );
  }

  const resolvedName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()
      : name;
  const imageAlt = resolvedName || translate("jemp.label.profile", "Profile");
  const imageSrc = profile?.profilePictureUrl || "/static/default-profile.png";

  return (
    <div className={classes.card}>
      {title && <h3 className={classes.cardTitle}>{title}</h3>}
      <div className={classes.photoSection}>
        <img src={imageSrc} alt={imageAlt} className={classes.photo} />
      </div>
      {infoContent}
      <br />
    </div>
  );
};
