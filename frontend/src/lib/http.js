const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") || "";

export const buildUrl = (path) => `${API_BASE}${path}`;

export const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authorizedFetch = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await safeParseMessage(response);
    throw new Error(message || "Request failed");
  }

  return response.json();
};

const safeParseMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error || payload?.msg;
  } catch (error) {
    return null;
  }
};

