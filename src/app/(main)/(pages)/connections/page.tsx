// // need to check if using currentUser is appropriate here, or how to overcome it mentioned using charges, it is displaying error on user: id, saying doesnt exist on useUserReturn

// import { CONNECTIONS } from "@/src/lib/constants";
// import React from "react";
// import ConnectionCard from "./_components/connection-card";
// import { currentUser } from "@clerk/nextjs/server";
// import { onDiscordConnect } from "./_actions/discord-connection";
// import { onNotionConnect } from "./_actions/notion-connection";
// import { onSlackConnect } from "./_actions/slack-connection";
// import { getUserData } from "./_actions/get-user";

// type Props = {
//   searchParams?: { [key: string]: string | undefined };
// };

// const Connections = async (props: Props) => {
//   const {
//     webhook_id,
//     webhook_name,
//     webhook_url,
//     guild_id,
//     guild_name,
//     channel_id,
//     access_token,
//     workspace_name,
//     workspace_icon,
//     workspace_id,
//     database_id,
//     app_id,
//     authed_user_id,
//     authed_user_token,
//     slack_access_token,
//     bot_user_id,
//     team_id,
//     team_name,
//   } = props.searchParams ?? {
//     webhook_id: "",
//     webhook_name: "",
//     webhook_url: "",
//     guild_id: "",
//     guild_name: "",
//     channel_id: "",
//     access_token: "",
//     workspace_name: "",
//     workspace_icon: "",
//     workspace_id: "",
//     database_id: "",
//     app_id: "",
//     authed_user_id: "",
//     authed_user_token: "",
//     slack_access_token: "",
//     bot_user_id: "",
//     team_id: "",
//     team_name: "",
//   };

//   const user = await currentUser();
//   if (!user) return null;

//   const onUserConnections = async () => {
//     console.log(database_id);
//     await onDiscordConnect(
//       channel_id!,
//       webhook_id!,
//       webhook_name!,
//       webhook_url!,
//       user.id,
//       guild_name!,
//       guild_id!,
//     );
//     await onNotionConnect(
//       access_token!,
//       workspace_id!,
//       workspace_icon!,
//       workspace_name!,
//       database_id!,
//       user.id,
//     );

//     await onSlackConnect(
//       app_id!,
//       authed_user_id!,
//       authed_user_token!,
//       slack_access_token!,
//       bot_user_id!,
//       team_id!,
//       team_name!,
//       user.id,
//     );

//     const connections: any = {};

//     const user_info = await getUserData(user.id);

//     //get user info with all connections
//     user_info?.connections.map((connection) => {
//       connections[connection.type] = true;
//       return (connections[connection.type] = true);
//     });

//     // Google Drive connection will always be true
//     // as it is given access during the login process
//     return { ...connections, "Google Drive": true };
//   };

//   const connections = await onUserConnections();

//   return (
//     <div className="relative flex flex-col gap-4">
//       <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
//         Connections
//       </h1>
//       <div className="relative flex flex-col gap-4">
//         <section className="flex flex-col gap-4 p-6 text-muted-foreground">
//           Connect all your apps directly from here. You may need to connect
//           these apps regularly to refresh verification
//           {CONNECTIONS.map((connection) => (
//             <ConnectionCard
//               key={connection.title}
//               description={connection.description}
//               title={connection.title}
//               icon={connection.image}
//               type={connection.title}
//               connected={connections}
//             />
//           ))}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Connections;

import { CONNECTIONS } from "@/src/lib/constants";
import React from "react";
import ConnectionCard from "./_components/connection-card";
import { currentUser } from "@clerk/nextjs/server";
import { onDiscordConnect } from "./_actions/discord-connection";
import { onNotionConnect } from "./_actions/notion-connection";
import { onSlackConnect } from "./_actions/slack-connection";
import { getUserData } from "./_actions/get-user";

type Props = {
  searchParams?:
    | { [key: string]: string | undefined }
    | URLSearchParams
    | undefined;
};

const resolveParam = (params: any, key: string) => {
  if (!params) return "";
  // handle URLSearchParams-like API
  if (typeof params.get === "function") return params.get(key) ?? "";
  // handle plain object
  return params[key] ?? "";
};

const Connections = async ({ searchParams }: Props) => {
  // IMPORTANT: await searchParams before using it
  const params = await (searchParams as any);

  const webhook_id = resolveParam(params, "webhook_id");
  const webhook_name = resolveParam(params, "webhook_name");
  const webhook_url = resolveParam(params, "webhook_url");
  const guild_id = resolveParam(params, "guild_id");
  const guild_name = resolveParam(params, "guild_name");
  const channel_id = resolveParam(params, "channel_id");
  const access_token = resolveParam(params, "access_token");
  const workspace_name = resolveParam(params, "workspace_name");
  const workspace_icon = resolveParam(params, "workspace_icon");
  const workspace_id = resolveParam(params, "workspace_id");
  const database_id = resolveParam(params, "database_id");
  const app_id = resolveParam(params, "app_id");
  const authed_user_id = resolveParam(params, "authed_user_id");
  const authed_user_token = resolveParam(params, "authed_user_token");
  const slack_access_token = resolveParam(params, "slack_access_token");
  const bot_user_id = resolveParam(params, "bot_user_id");
  const team_id = resolveParam(params, "team_id");
  const team_name = resolveParam(params, "team_name");

  const user = await currentUser();
  if (!user) return null;

  const onUserConnections = async () => {
    console.log("database_id:", database_id);

    // Only call each connector if we actually received the necessary params
    if (channel_id || webhook_id) {
      await onDiscordConnect(
        channel_id,
        webhook_id,
        webhook_name,
        webhook_url,
        user.id,
        guild_name,
        guild_id,
      );
    }

    if (access_token || workspace_id || database_id) {
      await onNotionConnect(
        access_token,
        workspace_id,
        workspace_icon,
        workspace_name,
        database_id,
        user.id,
      );
    }

    if (app_id || authed_user_id || slack_access_token) {
      await onSlackConnect(
        app_id,
        authed_user_id,
        authed_user_token,
        slack_access_token,
        bot_user_id,
        team_id,
        team_name,
        user.id,
      );
    }

    const connections: any = {};
    const user_info = await getUserData(user.id);

    user_info?.connections?.forEach((connection: any) => {
      connections[connection.type] = true;
    });

    return { ...connections, "Google Drive": true };
  };

  const connections = await onUserConnections();

  return (
    <div className="relative flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Connections
      </h1>
      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 p-6 text-muted-foreground">
          Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification
          {CONNECTIONS.map((connection) => (
            <ConnectionCard
              key={connection.title}
              description={connection.description}
              title={connection.title}
              icon={connection.image}
              type={connection.title}
              connected={connections}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Connections;
