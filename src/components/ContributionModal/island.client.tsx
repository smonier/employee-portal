import type { FC } from "react";
import { useEffect } from "react";

type Props = {
  modalId: string;
};

const ContributionModalIsland: FC<Props> = ({ modalId }) => {
  useEffect(() => {
    const openButtons = Array.from(document.querySelectorAll<HTMLElement>(`[data-modal-open="${modalId}"]`));
    const overlay = document.querySelector<HTMLElement>(`[data-modal-overlay="${modalId}"]`);
    const closeButtons = Array.from(document.querySelectorAll<HTMLElement>(`[data-modal-close="${modalId}"]`));

    if (!overlay) return;

    const open = () => {
      overlay.dataset.open = "true";
      overlay.removeAttribute("aria-hidden");
      document.body.classList.add("modal-open");
    };

    const close = () => {
      overlay.dataset.open = "false";
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const onOverlayClick = (event: MouseEvent) => {
      if (event.target === overlay) {
        close();
      }
    };

    openButtons.forEach((button) => button.addEventListener("click", open));
    closeButtons.forEach((button) => button.addEventListener("click", close));
    overlay.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      openButtons.forEach((button) => button.removeEventListener("click", open));
      closeButtons.forEach((button) => button.removeEventListener("click", close));
      overlay.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [modalId]);

  return null;
};

export default ContributionModalIsland;
