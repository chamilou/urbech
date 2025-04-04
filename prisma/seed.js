import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create addresses
  const address1 = await prisma.address.create({
    data: {
      label: "Main Office",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
  });

  const address2 = await prisma.address.create({
    data: {
      label: "Warehouse",
      street: "456 Industrial Ave",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
  });

  // 2. Create a user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // You could update fields if needed
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword123",
      role: "ADMIN",
      address: { connect: { id: address1.id } },
    },
  });

  // 3. Create a customer linked to the user
  const customer = await prisma.customer.create({
    data: {
      name: "John Customer",
      email: "john@example.com",
      phone: "+1234567890",
      group: "Retail",
      address: { connect: { id: address2.id } },
      user: { connect: { id: user.id } },
    },
  });

  // 4. Create partners
  await prisma.partner.createMany({
    data: [
      {
        name: "FastPost Delivery",
        type: "DELIVERY",
        phone: "+111222333",
        email: "fast@post.com",
        addressId: address2.id,
      },
      {
        name: "MegaSupplier",
        type: "SUPPLIER",
        email: "orders@mega.com",
        addressId: address1.id,
      },
    ],
  });

  // 5. Create a category
  const category = await prisma.category.create({
    data: {
      name: "Electronics",
    },
  });

  // 6. Create a product
  await prisma.product.create({
    data: {
      name: "Smartphone X",
      price: 699.99,
      stock: 50,
      categoryId: category.id,
      originAddressId: address1.id,
    },
  });

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
