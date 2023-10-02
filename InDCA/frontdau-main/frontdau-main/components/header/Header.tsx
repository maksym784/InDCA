"use client";
import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { UserPlus, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Path } from "@/lib/types/global.type";
import ButtonLogIn from "../ButtonLogIn/Buttonlogin";

const Header = () => {
  const pathname = usePathname();
  const path: Path = useMemo(() => {
    return {
      deposit: pathname.includes("deposit"),
      overview: pathname.includes("overview"),
      informations: pathname.includes("informations"),
    };
  }, [pathname]);

  return (
    <div>
      <div className="grid grid-cols-3 px-6 py-2 bg-uniDark3 text-white">
        <div className=" flex items-center col-span-1 text-xl font-semibold gap-2 ">
          In DCA
        </div>

        <div className=" col-span-1 center gap-6 center flex-row  ">
          <Link
            className={`flex gap-1 ${path.deposit && "text-uniPink"} `}
            href={"/deposit"}
          >
            <UserPlus /> Deposit
          </Link>

          <Link
            href={"/overview"}
            className={`flex gap-1 ${path.overview && "text-uniPink"} `}
          >
            <Activity /> Overview
          </Link>

          <Link
            className={`flex gap-1 ${path.informations && "text-uniPink"} `}
            href={"/informations"}
          >
            <UserPlus /> Infomations
          </Link>
        </div>

        <div className="col-span-1 flex justify-end">
          <ButtonLogIn />
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
