import { useState, useEffect } from 'react';

const cache = new Map<string, string>();

export function useUnsplashPhoto(query: string) {
  const [url, setUrl] = useState(cache.get(query) || '');
  const [loading, setLoading] = useState(!cache.has(query));

  useEffect(() => {
    if (cache.has(query)) return;

    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      setLoading(false);
      return;
    }

    fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${accessKey}`
    )
      .then((r) => r.json())
      .then((data) => {
        const photoUrl = data?.urls?.regular;
        if (photoUrl) {
          cache.set(query, photoUrl);
          setUrl(photoUrl);
        }
      })
      .catch(() => {
        /* silent error handling */
      })
      .finally(() => setLoading(false));
  }, [query]);

  return { url, loading };
}
