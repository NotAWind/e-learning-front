"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { useSession } from "@/app/contexts/sessionContext";
import { useRouter } from "next/navigation";

export function Menu() {
  const { setSession, session } = useSession();
  const userName = session?.userName;
  const router = useRouter();

  const handleLogOut = () => {
    router.push("/login");
    setSession(null);
  };
  return (
    <div className="fixed w-screen top-0 bg-white px-2 lg:px-4 flex items-center">
      <Menubar className="rounded-none border-b border-none flex-1">
        <MenubarMenu>
          <MenubarTrigger className="font-bold cursor-pointer">
            <Image
              className="pr-2"
              src="/logo.png"
              alt="Logo"
              width={38}
              height={38}
              priority
            />
            E-Learn
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="relative cursor-pointer">
            Account
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleLogOut}>Quit E-learn</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="text-sm">
        Welcome, <span className="font-bold">{userName}</span> !
      </div>
    </div>
  );
}
