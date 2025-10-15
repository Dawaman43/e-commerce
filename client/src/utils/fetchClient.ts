export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // ✅ ADD DEBUG LOGS
  console.log("=== FETCHCLIENT DEBUG ===");
  console.log("URL:", url);
  console.log(
    "Options body type:",
    options.body instanceof FormData ? "FormData" : typeof options.body
  );
  console.log("Options headers (incoming):", options.headers);

  // ✅ Build headers dynamically
  let headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Merge user headers
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      (headers as any)[key] = value;
    });
  }

  // ✅ CRITICAL FIX: Omit Content-Type for FormData (browser auto-sets multipart/form-data)
  if (options.body instanceof FormData) {
    console.log("Detected FormData - omitting Content-Type");
    delete (headers as any)["Content-Type"];
  } else {
    // Default to JSON for non-FormData
    (headers as any)["Content-Type"] = "application/json";
  }

  console.log("Final headers:", headers);
  console.log("========================");

  const res = await fetch(url, {
    ...options,
    headers, // Use the dynamic headers
  });

  // ✅ ADD RESPONSE DEBUG LOGS
  console.log("=== FETCHCLIENT RESPONSE DEBUG ===");
  console.log("Response status:", res.status);
  console.log("Response ok:", res.ok);
  console.log(
    "Response headers (server):",
    Object.fromEntries(res.headers.entries())
  );
  const responseText = await res.clone().text();
  console.log(
    "Raw response text (first 200 chars):",
    responseText.substring(0, 200)
  );
  console.log("================================");

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  return res.json();
};
