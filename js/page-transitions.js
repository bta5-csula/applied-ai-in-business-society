(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const supportsNativeTransitions = "startViewTransition" in document;
  const exitDuration = 220;
  let navigationPending = false;

  if (!supportsNativeTransitions && !reducedMotion.matches) {
    root.classList.add("is-page-entering");
    window.addEventListener("DOMContentLoaded", () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          root.classList.remove("is-page-entering");
        });
      });
    });
  }

  function isSameDocumentHash(url) {
    return (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      Boolean(url.hash)
    );
  }

  function shouldTransition(event, anchor, url) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target.toLowerCase() !== "_self")
    ) {
      return false;
    }

    if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) {
      return false;
    }

    return !isSameDocumentHash(url);
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || navigationPending) return;

    const url = new URL(anchor.href, window.location.href);
    if (!shouldTransition(event, anchor, url)) return;

    if (supportsNativeTransitions) return;

    event.preventDefault();
    navigationPending = true;
    root.classList.add("is-page-leaving");

    const delay = reducedMotion.matches ? 0 : exitDuration;
    window.setTimeout(() => window.location.assign(url.href), delay);
  });

  window.addEventListener("pageshow", () => {
    navigationPending = false;
    root.classList.remove("is-page-entering");
    root.classList.remove("is-page-leaving");
  });
})();
