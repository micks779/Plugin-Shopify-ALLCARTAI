import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  try {
    const data = await request.json();
    const { product_id, email, quantity, shipping } = data;
    if (!product_id || !email || !quantity) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build the order payload
    const orderPayload = {
      order: {
        line_items: [
          {
            variant_id: product_id,
            quantity: Number(quantity),
          },
        ],
        email,
        ...(shipping && { shipping_address: shipping }),
        financial_status: "paid", // Mark as paid for test/dev
      },
    };

    const response = await admin.rest.post({
      path: "/orders",
      type: "json",
      data: orderPayload,
      apiVersion: "2023-07",
    });
    return json(response.body.order);
  } catch (error) {
    return json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}; 