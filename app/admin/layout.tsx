"use client";

import * as React from "react";
import { Sidebar } from "./components/sidebar";
import { Menu } from "./components/menu";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/contexts/sessionContext";
import { usePathname } from "next/navigation";

const adminPathNames = [
  "/admin/addSchool",
  "/admin/addUser",
  "/admin/schoolList",
  "/admin/userList",
];
const teacherPathNames = [
  "/admin/addCourse",
  "/admin/courseComments",
  "/admin/courseDetail",
  "/admin/courseList",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const role = session?.role;
  const pathname = usePathname();
  const router = useRouter();
  if (role !== "admin" && adminPathNames.includes(pathname)) {
    router.push("/login");
  }
  if (role !== "teacher" && teacherPathNames.includes(pathname)) {
    router.push("/login");
  }

  return (
    <>
      <Menu />
      <div
        className={`mt-12 fixed top-0 left-0 grid grid-cols-6 h-screen-minus-48 overflow-hidden`}
      >
        <Sidebar />
        <main className="col-start-2 col-end-7 mr-4 h-full overflow-scroll py-10 px-10">
          {children}
        </main>
      </div>
    </>
  );
}
