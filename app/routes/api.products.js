import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  try {
    const response = await admin.rest.get({
      path: "/products",
      type: "json",
      apiVersion: "2023-07",
    });
    return json(response.body.products);
  } catch (error) {
    return json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}; 