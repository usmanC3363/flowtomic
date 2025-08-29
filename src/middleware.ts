// import { authMiddleware  } from "@clerk/nextjs";

// export default authMiddleware ({
//   publicRoutes: [
//     "/",
//     "/api/clerk-webhook",
//     "/api/drive-activity/notification",
//     "/api/payment/success",
//   ],
//   ignoredRoutes: [
//     "/api/auth/callback/discord",
//     "/api/auth/callback/notion",
//     "/api/auth/callback/slack",
//     "/api/flow",
//     "/api/cron/wait",
//   ],
//   // signInUrl: "/sign-in",
//   // signUpUrl: "/sign-up",
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// https://www.googleapis.com/auth/userinfo.email
// https://www.googleapis.com/auth/userinfo.profile
// https://www.googleapis.com/auth/drive.activity.readonly
// https://www.googleapis.com/auth/drive.metadata
// https://www.googleapis.com/auth/drive.readonly

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk-webhook",
  "/api/drive-activity/notification",
  "/api/payment/success",
  "/api/auth/callback/(.*)", // <-- covers Discord/Notion/Slack
  "/api/flow",
  "/api/cron/wait",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
