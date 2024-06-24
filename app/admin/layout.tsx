import * as React from "react";
import { Sidebar } from "./components/sidebar";
import { Menu } from "./components/menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Menu />
      <div className="grid grid-cols-6">
        <Sidebar />
        <div className="col-start-2 col-end-7 mr-4">{children}</div>
      </div>
    </>
  );
}
