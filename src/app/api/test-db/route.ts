// Create this file: api/test-db/route.ts
import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Testing database connection...");

    // Test 1: Basic connection
    await db.$connect();
    console.log("✅ Database connection successful");

    // Test 2: Check if User table exists and get count
    const userCount = await db.user.count();
    console.log(`📊 Total users in database: ${userCount}`);

    // Test 3: Get recent users
    const users = await db.user.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    console.log("👥 Recent users:", users);

    // Test 4: Test creating a user (then delete it)
    const testUser = await db.user.create({
      data: {
        clerkId: "test_user_" + Date.now(),
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        profileImage: "",
      },
    });
    console.log("✅ Test user created:", testUser);

    // Clean up test user
    await db.user.delete({
      where: { id: testUser.id },
    });
    console.log("🗑️ Test user cleaned up");

    await db.$disconnect();

    return NextResponse.json({
      status: "✅ Database is working perfectly!",
      details: {
        connectionStatus: "Connected",
        userCount: userCount,
        recentUsers: users.map((u) => ({
          id: u.id,
          clerkId: u.clerkId,
          email: u.email,
          name: u.name,
        })),
        testPassed: true,
      },
    });
  } catch (error) {
    console.error("❌ Database test failed:", error);

    return NextResponse.json(
      {
        status: "❌ Database connection failed",
        error: {
          message: error.message,
          code: error.code || "Unknown",
          name: error.name || "Unknown Error",
        },
        troubleshooting: {
          checkDatabaseUrl: "Make sure DATABASE_URL is set in .env.local",
          checkPrisma: "Run: pnpm prisma generate && pnpm prisma db push",
          checkSchema: "Verify your Prisma schema has a User model",
        },
      },
      { status: 500 },
    );
  }
}

// Also add a POST method to test webhook-like behavior
export async function POST() {
  try {
    // Simulate webhook data
    const mockWebhookData = {
      id: "user_test_" + Date.now(),
      email_addresses: [
        { email_address: `webhook-test${Date.now()}@example.com` },
      ],
      first_name: "Webhook",
      last_name: "Test",
      image_url: "https://example.com/avatar.jpg",
    };

    const { id, email_addresses, first_name, image_url } = mockWebhookData;
    const email = email_addresses[0]?.email_address;

    console.log("🧪 Testing webhook-style database operation...");

    const result = await db.user.upsert({
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

    console.log("✅ Webhook test successful:", result);

    // Clean up
    await db.user.delete({ where: { id: result.id } });

    return NextResponse.json({
      status: "✅ Webhook simulation successful!",
      result: result,
    });
  } catch (error: any) {
    console.error("❌ Webhook simulation failed:", error);
    return NextResponse.json(
      {
        status: "❌ Webhook simulation failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
