import { getProductById } from "@/lib/products";

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} | MyShop`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.mainImage,
          alt: product.name,
        },
      ],
    },
  };
}
