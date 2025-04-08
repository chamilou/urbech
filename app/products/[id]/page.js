"use client";
import { useParams } from "next/navigation";
import ProductDetailPage from "./ProductDetailPage";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;
  return <ProductDetailPage productId={params.id} />;
}
