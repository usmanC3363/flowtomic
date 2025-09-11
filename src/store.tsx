// created for render-connection-accordion, using zustand

import { create } from "zustand";
import { Option } from "./lib/types";

type FlowtomicStore = {
  googleFile: any;
  setGoogleFile: (googleFile: any) => void;
  slackChannels: Option[];
  setSlackChannels: (slackChannels: Option[]) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void;
};

// invoking function two times,
export const useFlowtomicStore = create<FlowtomicStore>()((set) => ({
  googleFile: {},
  setGoogleFile: (googleFile: any) => set({ googleFile }),
  slackChannels: [],
  setSlackChannels: (slackChannels: Option[]) => set({ slackChannels }),
  selectedSlackChannels: [],
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) =>
    set({ selectedSlackChannels }),
}));
