type LikeRpcResult = {
  like_count: number;
  liked: boolean;
};

type ViewRpcResult = {
  view_count: number;
  incremented: boolean;
};

function parseRpcObject(data: unknown): Record<string, unknown> | null {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return null;
}

export function parseLikeRpcResult(data: unknown): LikeRpcResult {
  const result = parseRpcObject(data);

  return {
    like_count: Number(result?.like_count) || 0,
    liked: Boolean(result?.liked),
  };
}

export function parseViewRpcResult(data: unknown): ViewRpcResult {
  const result = parseRpcObject(data);

  return {
    view_count: Number(result?.view_count) || 0,
    incremented: Boolean(result?.incremented),
  };
}
