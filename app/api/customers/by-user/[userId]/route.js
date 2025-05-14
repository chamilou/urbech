import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_, context) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: { userId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: customer.id });
  } catch (err) {
    console.error("Error fetching customer:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";

// export async function GET(request, { params }) {
//   const { userId } = params; // Direct destructuring from params

//   // Validation
//   if (!userId || typeof userId !== 'string') {
//     return NextResponse.json(
//       { error: "Valid userId is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const customer = await prisma.customer.findFirst({
//       where: { userId },
//       select: { // Only select needed fields
//         id: true,
//         // Add other fields you need
//       }
//     });

//     if (!customer) {
//       return NextResponse.json(
//         { message: "Customer not found" }, // More user-friendly message
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(customer); // Return full customer object
//   } catch (err) {
//     console.error(`Error fetching customer ${userId}:`, err);
//     return NextResponse.json(
//       { 
//         error: "Internal server error",
//         details: process.env.NODE_ENV === 'development' ? err.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }