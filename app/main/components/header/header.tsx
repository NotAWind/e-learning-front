"use client";
import * as React from "react";
import Link from "next/link";
import style from "./header.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "@/app/contexts/sessionContext";
import { useToast } from "@/components/ui/use-toast";
import { RequestPrefix } from "@/app/utils/request";
import { useRouter } from "next/navigation";

export default function Header() {
  const { session, setSession } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handlePasswordReset = async () => {
    const updatedUser = {
      password: "123456",
    };

    const response = await fetch(`${RequestPrefix}/users/${session?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      toast({
        title: "Profile Updated",
        description: "You have successfully reset your password.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error resetting your password.",
      });
    }
  };

  const handleLogOut = () => {
    setSession(null);
    router.push("/login");
  };

  return (
    <div className={`${style.header}`}>
      <Link key={"/main/home"} href={"/main/home"}>
        <Image
          className="m-4 cursor-pointer"
          src="/logo.png"
          alt="Logo"
          width={38}
          height={38}
          priority
        />
      </Link>

      <NavigationMenu className={style.navigationMenu}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>My Course</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <ListItem
                  href="/main/finishedCourse"
                  title="Finished"
                ></ListItem>
                <ListItem href="/main/ongoingCourse" title="Ongoing"></ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className={style.empty}></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className={style.avatar}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>NA</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link key={"/main/myProfile"} href={"/main/myProfile"}>
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePasswordReset}>
              Password Reset
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
