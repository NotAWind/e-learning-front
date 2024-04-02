import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";

export function Menu() {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
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
          <MenubarItem>Quit E-learn</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
