"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, University } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import style from "./page.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Image
          className={style.logoImg}
          src="/logo.png"
          alt="Logo"
          width={38}
          height={38}
          priority
        />
        <NavigationMenu className={style.navigationMenu}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>My Course</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  <ListItem href="/docs" title="Finished"></ListItem>
                  <ListItem
                    href="/docs/installation"
                    title="Ongoing"
                  ></ListItem>
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
              <DropdownMenuItem>Password Reset</DropdownMenuItem>
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className={`${style.content} px-5`}>
        <div
          className={`${style.searchBar} grid grid-cols-3 gap-x-1 gap-y-2.5 max-w-[650px]`}
        >
          <Input className={"col-span-3"} type="search" placeholder="Search" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="School" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">School A</SelectItem>
              <SelectItem value="dark">School B</SelectItem>
              <SelectItem value="system">Scholl C</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Math</SelectItem>
              <SelectItem value="dark">Computer</SelectItem>
              <SelectItem value="system">Philosophy</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Teacher A</SelectItem>
              <SelectItem value="dark">Teacher B</SelectItem>
              <SelectItem value="system">Teacher C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div
          className={`${style.courseList} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-screen-xl py-8 gap-5`}
        >
          {Array.from({ length: 10 }, (_, idx) => idx).map((value) => (
            <Card key={value} className="w-full overflow-hidden relative">
              <img className="object-cover h-56 w-full" src="/trees.jpg"></img>
              <span
                className={`${style.courseType} text-xs py-0.5 px-2.5 absolute top-0 right-0`}
              >
                Live Stream
              </span>
              <CardHeader>
                <div className="flex items-center ">
                  <University size={28} color="green" absoluteStrokeWidth />
                  <span className="pl-2 line-clamp-2 text-muted-foreground text-sm">
                    Limerick University
                  </span>
                </div>

                <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Data Analytics
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  This is your path to a career in data analytics. In this
                  program, you’ll learn in-demand skills that will have you
                  job-ready in less than 6 months. No degree or experience
                  required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm ">
                  <span className="pr-1">4.8</span>
                  <Star size={16} fill="green" color="green" />
                  <span className="pl-1 text-muted-foreground">
                    (1k reviews)
                  </span>
                </div>
                <span className="text-sm  text-muted-foreground">
                  Computer·Math
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
