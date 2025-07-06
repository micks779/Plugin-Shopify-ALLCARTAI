import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Check API key in header
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.ALLCARTAI_API_KEY) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, admin } = await authenticate.admin(request);

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
    const responseBody = await response.json(); // ✅ Parse JSON properly

    console.log("GraphQL response:", responseBody);

    const products = responseBody.data.products.edges.map(edge => edge.node);
    return json(products);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
};
