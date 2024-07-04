"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  UserRoundCog,
  UserRoundPlus,
  ListCollapse,
  FilePlus2,
  School,
  HousePlus,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">User</h2>
        <div className="space-y-1">
          <Link key={"/admin/userList"} href={"/admin/userList"}>
            <Button
              variant={pathname === "/admin/userList" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <UserRoundCog className="mr-2 h-4 w-4" />
              Users List
            </Button>
          </Link>
          <Link key={"/admin/addUser"} href={"/admin/addUser"}>
            <Button
              variant={pathname === "/admin/addUser" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <UserRoundPlus className="mr-2 h-4 w-4" />
              Add Users
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Course
        </h2>
        <div className="space-y-1">
          <Link key={"/admin/courseList"} href={"/admin/courseList"}>
            <Button
              variant={pathname === "/admin/courseList" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <ListCollapse className="mr-2 h-4 w-4" />
              Courses List
            </Button>
          </Link>

          <Link key={"/admin/addCourse"} href={"/admin/addCourse"}>
            <Button
              variant={pathname === "/admin/addCourse" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          School
        </h2>
        <div className="space-y-1">
          <Link key={"/admin/schoolList"} href={"/admin/schoolList"}>
            <Button
              variant={pathname === "/admin/schoolList" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <School className="mr-2 h-4 w-4" />
              School List
            </Button>
          </Link>

          <Link key={"/admin/addSchool"} href={"/admin/addSchool"}>
            <Button
              variant={pathname === "/admin/addSchool" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <HousePlus className="mr-2 h-4 w-4" />
              Add School
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
