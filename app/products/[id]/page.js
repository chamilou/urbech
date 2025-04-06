"use client";

import ProductDetailPage from "./ProductDetailPage";

export default function ProductPage({ params }) {
  return <ProductDetailPage productId={params.id} />;
}
