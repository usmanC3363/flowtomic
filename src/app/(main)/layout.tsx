import React from "react";
import MenuOptions from "../../components/sidebar";
import InfoBar from "@/src/components/infobar";

type Props = { children: React.ReactNode };

const layout = (props: Props) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <MenuOptions />
      <div className="w-full">
        <InfoBar />
        {props.children}
      </div>
    </div>
  );
};

export default layout;
