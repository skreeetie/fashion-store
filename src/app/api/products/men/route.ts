import { NextResponse } from "next/server";
import { getScopedProductsHandler } from "@/backend/entities/product/api/get-products.handler";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.NEXT_PUBLIC_API_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

function createCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();

  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Vary", "Origin");

  return headers;
}

export async function GET(request: Request) {
  const response = await getScopedProductsHandler(request, "men");
  const corsHeaders = createCorsHeaders(request.headers.get("origin"));

  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: createCorsHeaders(request.headers.get("origin")),
  });
}
