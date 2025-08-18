"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { menuOptions } from "../../lib/constants";
import clsx from "clsx";
import { Separator } from "../../components/ui/separator";
import { Database, GitBranch, LucideMousePointerClick } from "lucide-react";
import { ModeToggle } from "../global/mode-toggle";
// import { ModeToggle } from "../global/";

type Props = {};

const MenuOptions = (props: Props) => {
  const pathName = usePathname();

  return (
    <nav className="flex h-screen flex-col items-center justify-between gap-10 overflow-scroll px-2 py-6 dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-8">
        <Link className="flex flex-row font-bold" href="/">
          fuzzie.
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group flex h-8 w-8 scale-[1.5] cursor-pointer items-center justify-center rounded-lg p-[3px]",
                        {
                          "bg-[#EEE0FF] dark:bg-[#2F006B]":
                            pathName === menuItem.href,
                        },
                      )}
                    >
                      <menuItem.Component
                        selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 text-white backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        <Separator />
        <div className="flex h-56 flex-col items-center gap-9 overflow-scroll rounded-full border-[1px] py-4 pl-4 dark:bg-[#353346]/30">
          <StepIcon
            icon={LucideMousePointerClick}
            divClass="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
            iconClass="dark:text-white"
            showLine
          />
          <StepIcon
            icon={GitBranch}
            divClass="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
            iconClass="text-muted-foreground"
            showLine
          />
          <StepIcon
            icon={Database}
            divClass="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
            iconClass="text-muted-foreground"
            showLine
          />
          <StepIcon
            icon={GitBranch}
            divClass="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]"
            iconClass="text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <ModeToggle />
      </div>
    </nav>
  );
};

// <div className="">
//   <div className="">
//     <LucideMousePointerClick
//       className="dark:text-white"
//       size={18}
//     />
//     <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
//   </div>
//   <div className="">
//     <GitBranch
//       className="text-muted-foreground"
//       size={18}
//     />
//     <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
//   </div>
//   <div className="">
//     <Database
//       className="text-muted-foreground"
//       size={18}
//     />
//     <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
//   </div>
//   <div className="">
//     <GitBranch
//       className="text-muted-foreground"
//       size={18}
//     />
//   </div>
// </div>

export default MenuOptions;

const StepIcon = ({
  icon: Icon,
  showLine = false,
  iconClass = "",
  divClass = "",
}: {
  icon: React.ElementType;
  showLine?: boolean;
  iconClass?: string;
  divClass?: string;
}) => {
  return (
    <div className={divClass}>
      <Icon className={iconClass} size={18} />
      {showLine && (
        <div className="absolute -bottom-[30px] left-1/2 h-6 -translate-x-1/2 transform border-l-2 border-muted-foreground/50" />
      )}
    </div>
  );
};
