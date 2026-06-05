export function cacheHeaders(status: number): HeadersInit {
  if (status === 200) {
    return {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    };
  }
  return {
    "Cache-Control": "no-store",
  };
}

export function jsonResponse(data: unknown, status: number = 200): Response {
  return Response.json(data, {
    status,
    headers: cacheHeaders(status),
  });
}

export function errorResponse(message: string, status: number = 500): Response {
  return jsonResponse({ error: message }, status);
}
