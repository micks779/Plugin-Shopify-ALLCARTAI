import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  // Add logging for debugging
  console.log("Session:", session);
  console.log("Admin:", admin);

  if (!session || !admin) {
    return json({ error: "Unauthorized – No session found" }, { status: 401 });
  }

  try {
    const response = await admin.rest.get({
      path: "/products",
      type: "json",
      apiVersion: "2023-07",
    });
    return json(response.body.products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}; 