// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";
// import { Client } from "@notionhq/client";

// export async function GET(req: NextRequest) {
//   const code = req.nextUrl.searchParams.get("code");
//   const encoded = Buffer.from(
//     `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_API_SECRET}`,
//   ).toString("base64");
//   if (code) {
//     const response = await axios("https://api.notion.com/v1/oauth/token", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//         Authorization: `Basic ${encoded}`,
//         "Notion-Version": "2025-09-03",
//       },
//       data: JSON.stringify({
//         grant_type: "authorization_code",
//         code: code,
//         redirect_uri: process.env.NOTION_REDIRECT_URI!,
//       }),
//     });
//     if (response) {
//       const notion = new Client({
//         auth: response.data.access_token,
//       });
//       const databasesPages = await notion.search({
//         filter: {
//           value: "database",
//           property: "object",
//         },
//         sort: {
//           direction: "ascending",
//           timestamp: "last_edited_time",
//         },
//       });
//       const databaseId = databasesPages?.results?.length
//         ? databasesPages.results[0].id
//         : "";

//       console.log(databaseId);

//       return NextResponse.redirect(
//         `https://localhost:3000/connections?access_token=${response.data.access_token}&workspace_name=${response.data.workspace_name}&workspace_icon=${response.data.workspace_icon}&workspace_id=${response.data.workspace_id}&database_id=${databaseId}`,
//       );
//     }
//   }

//   return NextResponse.redirect("https://localhost:3000/connections");
// }

// src/app/api/auth/callback/notion/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      process.env.APP_ORIGIN
        ? `${process.env.APP_ORIGIN}/connections`
        : "http://localhost:3000/connections",
    );
  }

  // DEBUG: confirm envs are present (reduce logging in prod)
  console.log("NOTION_CLIENT_ID present:", !!process.env.NOTION_CLIENT_ID);
  console.log("NOTION_API_SECRET present:", !!process.env.NOTION_API_SECRET);
  console.log("NOTION_REDIRECT_URI:", process.env.NOTION_REDIRECT_URI);

  try {
    const tokenResp = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      },
      {
        auth: {
          username: process.env.NOTION_CLIENT_ID || "",
          password: process.env.NOTION_API_SECRET || "",
        },
        headers: {
          "Content-Type": "application/json",
          // keep the Notion-Version you want to target
          "Notion-Version": "2025-09-03",
        },
        timeout: 15000,
      },
    );

    const accessToken = tokenResp.data.access_token;
    // create notion client with the access token
    const notion = new Client({ auth: accessToken });

    // Search using the new allowed value "data_source"
    // const searchRes = await notion.search({
    //   filter: {
    //     property: "object",
    //     value: "data_source", // changed from "database"
    //   },
    //   sort: {
    //     direction: "ascending",
    //     timestamp: "last_edited_time",
    //   },
    // });

    // // LOG the full search response so you can see the shape and pick the right id
    // console.log("Notion search response:", JSON.stringify(searchRes, null, 2));

    // // Defensive extraction of an ID from likely shapes
    // let dataSourceId = "";
    // if (Array.isArray(searchRes?.results) && searchRes.results.length > 0) {
    //   const first = searchRes.results[0];
    //   if (first.object === "data_source" && first.id) {
    //     dataSourceId = first.id;
    //   } else if (first.data_source && first.data_source.id) {
    //     dataSourceId = first.data_source.id;
    //   } else if (first.id) {
    //     // fallback — pick whatever id exists
    //     dataSourceId = first.id;
    //   }
    // }

    // use `any` only for the call/response to avoid mismatched client types
    const searchRes: any = await (notion as any).search({
      filter: {
        property: "object",
        value: "data_source", // runtime value Notion expects
      },
      sort: {
        direction: "ascending",
        timestamp: "last_edited_time",
      },
    });

    // DEBUG: full shape so you can inspect the actual response
    console.log("Notion search response:", JSON.stringify(searchRes, null, 2));

    // Defensive runtime parsing
    let dataSourceId = "";
    if (Array.isArray(searchRes?.results) && searchRes.results.length > 0) {
      const first = searchRes.results[0] as any;

      // Many possible runtime shapes — check conservatively
      if (first && typeof first === "object") {
        if (first.object === "data_source" && typeof first.id === "string") {
          dataSourceId = first.id;
        } else if (
          first.data_source &&
          typeof first.data_source.id === "string"
        ) {
          dataSourceId = first.data_source.id;
        } else if (typeof first.id === "string") {
          // fallback: pick any id present
          dataSourceId = first.id;
        }
      }
    }
    // Build redirect target. Ensure this origin matches the redirect URI set in Notion dashboard.
    const origin =
      process.env.APP_ORIGIN ||
      (process.env.NOTION_REDIRECT_URI
        ? new URL(process.env.NOTION_REDIRECT_URI).origin
        : "http://localhost:3000");
    const redirectUrl = `${origin}/connections?access_token=${encodeURIComponent(accessToken)}&workspace_name=${encodeURIComponent(tokenResp.data.workspace_name || "")}&workspace_icon=${encodeURIComponent(tokenResp.data.workspace_icon || "")}&workspace_id=${encodeURIComponent(tokenResp.data.workspace_id || "")}&database_id=${encodeURIComponent(dataSourceId)}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error("Notion OAuth token exchange failed:", err?.message);
    if (err.response) {
      console.error("status:", err.response.status);
      console.error(
        "response.data:",
        JSON.stringify(err.response.data, null, 2),
      );
    } else {
      console.error(err);
    }
    // Redirect with an error query param so UI can show a helpful message
    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    return NextResponse.redirect(
      `${origin}/connections?error=notion_token_failed`,
    );
  }
}
