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
    const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              descriptionHtml
              images(first: 1) { edges { node { src } } }
              variants(first: 1) { edges { node { price } } }
            }
          }
        }
      }
    `;
    const response = await admin.graphql(query);
    const products = response.body.data.products.edges.map(edge => edge.node);
    return json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}; 