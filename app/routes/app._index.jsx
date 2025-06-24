import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setError(null);
    try {
      const res = await fetch("/api/products", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Page>
      <TitleBar title="AllCartAI" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Welcome to AllCartAI
                </Text>
                <Text variant="bodyMd" as="p">
                  Your Shopify AI integration is ready. Use the API endpoints to connect your AllCartAI backend.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
      <div>
        <button onClick={fetchProducts}>Fetch Products</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {products && (
          <pre>{JSON.stringify(products, null, 2)}</pre>
        )}
      </div>
    </Page>
  );
}
