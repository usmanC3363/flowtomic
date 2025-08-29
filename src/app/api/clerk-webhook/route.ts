import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email_addresses, first_name, image_url } = body?.data;

    const email = email_addresses[0]?.email_address;
    console.log("✅", body);

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        name: first_name,
        profileImage: image_url,
      },
      create: {
        clerkId: id,
        email,
        name: first_name || "",
        profileImage: image_url || "",
      },
    });
    return new NextResponse("User updated in database successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating database:", error);
    return new NextResponse("Error updating user in database", { status: 500 });
  }
}

// import { db } from "@/src/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     console.log("🔥 Webhook started");

//     const body = await req.json();
//     console.log("📦 Full body received:", JSON.stringify(body, null, 2));

//     const { id, email_addresses, first_name, image_url, last_name } =
//       body?.data;

//     console.log("🔍 Extracted data:", {
//       id,
//       email_addresses,
//       first_name,
//       last_name,
//       image_url,
//     });

//     const email = email_addresses?.[0]?.email_address;

//     if (!id || !email) {
//       console.error("❌ Missing required fields:", { id, email });
//       return new NextResponse("Missing required user data", { status: 400 });
//     }

//     console.log("📧 Email extracted:", email);
//     console.log("🆔 Clerk ID:", id);

//     // Test database connection
//     console.log("🔌 Testing database connection...");
//     await db.$connect();
//     console.log("✅ Database connected");

//     const result = await db.user.upsert({
//       where: { clerkId: id },
//       update: {
//         email,
//         name: first_name || "",
//         profileImage: image_url || "",
//       },
//       create: {
//         clerkId: id,
//         email,
//         name: first_name || "",
//         profileImage: image_url || "",
//       },
//     });

//     console.log("✅ Database operation successful:", result);

//     await db.$disconnect();

//     return new NextResponse("User updated in database successfully", {
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error("❌ Webhook error details:");
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     console.error("Error name:", error.name);

//     if (error.code) {
//       console.error("Error code:", error.code);
//     }

//     return new NextResponse(
//       `Error updating user in database: ${error.message}`,
//       {
//         status: 500,
//       },
//     );
//   }
// }
