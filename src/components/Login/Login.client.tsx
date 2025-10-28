import clsx from "clsx";
import { t } from "i18next";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import LoginFormClient from "./LoginForm.client";
import WorkspaceNavigationClient from "./WorkspaceNavigation.client";
import type { JahiaUrlsProps, LoginPersonaProps } from "./types";
import classes from "./Login.client.module.css";
import alert from "~/templates/css/alert.module.css";

interface LoginClientProps {
  isLoggedIn: boolean;
  userHydrated?: string;
  urls: JahiaUrlsProps;
  mode: string;
  nodePath: string;
  isShowRememberMe: boolean;
  siteKey?: string;
  persona: LoginPersonaProps[];
}

const LoginClient = ({
  isLoggedIn,
  userHydrated,
  urls,
  mode,
  nodePath,
  isShowRememberMe,
  siteKey,
  persona,
}: LoginClientProps) => {
  const [user, setUser] = useState(userHydrated);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [isOpen, setIsOpen] = useState(false);

  const personaList = useMemo(() => persona ?? [], [persona]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const showModal = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const logout = async () => {
    await fetch(urls.logoutUrl);
    setLoggedIn(false);
  };

  const handleLoggedIn = () => {
    setLoggedIn(true);
    setIsOpen(false);
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  if (mode === "edit") {
    return (
      <div className={clsx(alert.dark, classes.fs6)} role="alert">
        {t("form.login.editModeWarning")}
      </div>
    );
  }

  return (
    <>
      {loggedIn ? (
        <>
          <h5 className={classes.capitalize}>{user}</h5>
          <ul className={classes.list}>
            <WorkspaceNavigationClient urls={urls} mode={mode} nodePath={nodePath} />
            <li>
              <button type="button" className={classes.btn} onClick={logout}>
                {t("form.login.logout")}
              </button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <h5 className={classes.capitalize}>{t("footer.backOffice")}</h5>
          <p>
            <a href={urls.loginUrl} className={classes.capitalize} onClick={showModal}>
              {t("form.login.login")}
            </a>
          </p>
        </>
      )}

      <div
        className={classes.modalOverlay}
        data-open={isOpen ? "true" : undefined}
        aria-hidden={isOpen ? undefined : "true"}
        onClick={handleOverlayClick}
      >
        <div
          className={classes.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-dialog-title"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 id="login-dialog-title" className={classes.hidden}>
            {t("form.login.login")}
          </h2>
          <button type="button" className={classes.close} onClick={() => setIsOpen(false)}>
            <span aria-hidden="true">&times;</span>
            <span className={classes.hidden}>{t("jemp.label.close")}</span>
          </button>

          <LoginFormClient
            loginUrl={urls.loginUrl}
            isShowRememberMe={isShowRememberMe}
            setUser={setUser}
            handleLoggedIn={handleLoggedIn}
            siteKey={siteKey}
            persona={personaList}
          />
        </div>
      </div>
    </>
  );
};

export default LoginClient;
