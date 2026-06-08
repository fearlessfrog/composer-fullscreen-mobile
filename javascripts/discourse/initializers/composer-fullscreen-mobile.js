import { apiInitializer } from "discourse/lib/api";

function updateComposerViewportVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;

  if (!vv) {
    root.style.setProperty("--composer-visual-top", "0px");
    root.style.setProperty("--composer-visual-vh", `${window.innerHeight}px`);
    return;
  }

  root.style.setProperty("--composer-visual-top", `${vv.offsetTop}px`);
  root.style.setProperty("--composer-visual-vh", `${vv.height}px`);
}

function bindComposerViewportListeners() {
  if (window.__composerFullscreenMobileViewportBound) {
    return;
  }

  window.__composerFullscreenMobileViewportBound = true;

  updateComposerViewportVars();

  window.visualViewport?.addEventListener("resize", updateComposerViewportVars);
  window.visualViewport?.addEventListener("scroll", updateComposerViewportVars);

  window.addEventListener("resize", updateComposerViewportVars);
  window.addEventListener("orientationchange", () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(updateComposerViewportVars);
    });
  });

  document.addEventListener(
    "focusin",
    () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(updateComposerViewportVars);
      });
    },
    true
  );

  document.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest(".toggle-fullscreen")) {
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateComposerViewportVars();

          document
            .querySelector("#reply-control.fullscreen .reply-area")
            ?.scrollTo(0, 0);
        });
      });
    },
    { passive: true }
  );
}

export default apiInitializer((api) => {
  api.modifyClass(
    "component:composer-toggles",
    (Superclass) =>
      class extends Superclass {
        get showFullScreenButton() {
          return !this.args.disableTextarea;
        }
      }
  );

  bindComposerViewportListeners();
});
