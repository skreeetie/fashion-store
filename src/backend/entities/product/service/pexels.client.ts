import { serverEnv } from "@/backend/shared/config/env";

type PexelsSearchResponse = {
  photos: Array<{
    src: {
      large2x: string;
      large: string;
    };
  }>;
};

export async function getPexelsImagesByQuery(query: string, count: number): Promise<string[]> {
  const apiKey = serverEnv.PEXELS_API_KEY;
  if (!apiKey || count <= 0 || query.trim().length === 0) {
    return [];
  }

  const images: string[] = [];
  const perPage = 40;
  const maxPages = Math.ceil(count / perPage) + 1;

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "portrait");
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      break;
    }

    const payload = (await response.json()) as PexelsSearchResponse;
    const pageImages = payload.photos.map((photo) => photo.src.large2x || photo.src.large).filter(Boolean);
    images.push(...pageImages);

    if (pageImages.length === 0 || images.length >= count) {
      break;
    }
  }

  return images.slice(0, count);
}

export async function getPexelsFashionImages(count: number): Promise<string[]> {
  return getPexelsImagesByQuery("fashion model lookbook", count);
}
