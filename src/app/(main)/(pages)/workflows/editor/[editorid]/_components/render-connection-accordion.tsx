"use client";
import React from "react";
import ConnectionCard from "@/src/app/(main)/(pages)/connections/_components/connection-card";
import { AccordionContent } from "@/src/components/ui/accordion";
import MultipleSelector from "@/src/components/ui/multiple-selector";
import { Connection } from "@/src/lib/types";
import { useNodeConnections } from "@/src/providers/connections-provider";
import { EditorState } from "@/src/providers/editor-provider";
import { useFlowtomicStore } from "@/src/store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const RenderConnectionAccordion = ({
  connection,
  state,
}: {
  connection: Connection;
  state: EditorState;
}) => {
  const {
    title,
    image,
    description,
    connectionKey,
    accessTokenKey,
    alwaysTrue,
    slackSpecial,
  } = connection;

  const { nodeConnection } = useNodeConnections();
  // importing values from store.tsx
  const { slackChannels, selectedSlackChannels, setSelectedSlackChannels } =
    useFlowtomicStore();

  const connectionData = (nodeConnection as any)[connectionKey];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isConnected =
    alwaysTrue ||
    (nodeConnection[connectionKey] &&
      accessTokenKey &&
      connectionData[accessTokenKey!]);

  return (
    <AccordionContent key={title}>
      {state.editor.selectedNode.data.title === title && (
        <>
          <ConnectionCard
            title={title}
            icon={image}
            description={description}
            type={title}
            connected={{ [title]: isConnected }}
          />
          {slackSpecial && isConnected && (
            <div className="p-6">
              {slackChannels?.length ? (
                <>
                  <div className="mb-4 ml-1">
                    Select the slack channels to send notification and messages:
                  </div>
                  <MultipleSelector
                    value={selectedSlackChannels}
                    onChange={setSelectedSlackChannels}
                    defaultOptions={slackChannels}
                    placeholder="Select channels"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </>
              ) : (
                "No Slack channels found. Please add your Slack bot to your Slack channel"
              )}
            </div>
          )}
        </>
      )}
    </AccordionContent>
  );
};

export default RenderConnectionAccordion;
