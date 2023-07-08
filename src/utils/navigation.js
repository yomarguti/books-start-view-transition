const isStartViewTransitionSupported =
  document.startViewTransition !== undefined;

const fetchPage = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  const [, data] = html.match(/<body>([\s\S]*)<\/body>/i);
  return data;
};

const startViewTransition = () => {
  if (!isStartViewTransitionSupported) return;

  window.navigation.addEventListener('navigate', (e) => {
    const toUrl = new URL(e.destination.url);

    if (location.origin !== toUrl.origin) return;

    e.intercept({
      async handler() {
        const data = await fetchPage(toUrl.pathname);

        document.startViewTransition(() => {
          document.body.innerHTML = data;
        });
      },
    });
  });
};

startViewTransition();
