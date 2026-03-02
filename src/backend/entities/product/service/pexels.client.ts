import { serverEnv } from "@/backend/shared/config/env";

type PexelsSearchResponse = {
  photos: Array<{
    src: {
      large2x: string;
      large: string;
    };
  }>;
};

export async function getPexelsFashionImages(count: number): Promise<string[]> {
  const apiKey = serverEnv.PEXELS_API_KEY;
  if (!apiKey || count <= 0) {
    return [];
  }

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", "fashion model lookbook");
  url.searchParams.set("orientation", "portrait");
  url.searchParams.set("per_page", String(Math.min(Math.max(count, 1), 30)));

  const response = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as PexelsSearchResponse;
  return payload.photos.map((photo) => photo.src.large2x || photo.src.large);
}
