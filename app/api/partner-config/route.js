// // app/api/partner-config/route.js

// import prisma from "@/lib/db";
// import { NextResponse } from "next/server";
// import { validatePartnerConfig, sanitizePartnerConfig } from "@/lib/validator";

// export async function GET() {
//   try {
//     const partner = await prisma.partner.findFirst();
    
//     // Return default empty config if no partner exists
//     if (!partner) {
//       return NextResponse.json({
//         headerTitle: "",
//         footerNote: "",
//         bankDetails: "",
//         contactInfo: "",
//         type:""||"SUPPLIER",
//         name:""||"MyShopData"
//       });
//     }
    
//     return NextResponse.json(partner);
//   } catch (error) {
//     console.error("GET /api/partner-config error:", error);
//     return NextResponse.json(
//       { error: "Failed to load configuration" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const sanitizedData = sanitizePartnerConfig(body);
    
//     // Validate input
//     const validation = validatePartnerConfig(sanitizedData);
//     if (!validation.valid) {
//       return NextResponse.json(
//         { 
//           error: "Invalid configuration data", 
//           details: validation.errors 
//         },
//         { status: 400 }
//       );
//     }
    
//     // Find or create partner configuration
//     let partner = await prisma.partner.findFirst();
    
//     if (!partner) {
//       partner = await prisma.partner.create({
//         data: sanitizedData
//       });
//     } else {
//       partner = await prisma.partner.update({
//         where: { id: partner.id },
//         data: sanitizedData
//       });
//     }
    
//     return NextResponse.json(partner);
    
//   } catch (error) {
//     console.error("POST /api/partner-config error:", error);
//     return NextResponse.json(
//       { error: "Failed to save configuration" },
//       { status: 500 }
//     );
//   }
// }


import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { validatePartnerConfig, sanitizePartnerConfig } from "@/lib/validator";

// GET specific partner config by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    
    if (!partnerId) {
      return NextResponse.json(
        { error: "partnerId parameter is required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id: partnerId }
    });
    
    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(partner);
  } catch (error) {
    console.error("GET /api/partner-config error:", error);
    return NextResponse.json(
      { error: "Failed to load configuration" },
      { status: 500 }
    );
  }
}

// Create or update partner config
export async function POST(request) {
  try {
    const body = await request.json();
    const { partnerId, ...configData } = body;
    
    if (!partnerId) {
      return NextResponse.json(
        { error: "partnerId is required" },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizePartnerConfig(configData);
    
    // Validate input
    const validation = validatePartnerConfig(sanitizedData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: "Invalid configuration data", 
          details: validation.errors 
        },
        { status: 400 }
      );
    }
    
    // Upsert partner configuration
    const partner = await prisma.partner.upsert({
      where: { id: partnerId },
      create: {
        id: partnerId,
        ...sanitizedData
      },
      update: sanitizedData
    });
    
    return NextResponse.json(partner);
    
  } catch (error) {
    console.error("POST /api/partner-config error:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

// Additional endpoints you might want:

// GET all partners (for selection)
// export async function GET(request) {
//   try {
//     const partners = await prisma.partner.findMany();
//     return NextResponse.json(partners);
//   } catch (error) {
//     console.error("GET /api/partners error:", error);
//     return NextResponse.json(
//       { error: "Failed to load partners" },
//       { status: 500 }
//     );
//   }
// }