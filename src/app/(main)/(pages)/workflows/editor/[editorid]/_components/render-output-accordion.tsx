// used in editor-canvas-sidebar

import { ConnectionProviderProps } from "@/src/providers/connections-provider";
import { EditorState } from "@/src/providers/editor-provider";
import { useFlowtomicStore } from "@/src/store";
import React from "react";
import ContentBasedOnTitle from "./content-based-on-title";

type Props = {
  state: EditorState;
  nodeConnection: ConnectionProviderProps;
};

const RenderOutputAccordion = ({ state, nodeConnection }: Props) => {
  // getting values from useFlowtomicStore in store.tsx
  const {
    googleFile,
    setGoogleFile,
    selectedSlackChannels,
    setSelectedSlackChannels,
  } = useFlowtomicStore();

  return (
    <ContentBasedOnTitle
      nodeConnection={nodeConnection}
      newState={state}
      file={googleFile}
      setFile={setGoogleFile}
      selectedSlackChannels={selectedSlackChannels}
      setSelectedSlackChannels={setSelectedSlackChannels}
    />
  );
};

export default RenderOutputAccordion;
