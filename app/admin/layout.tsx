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
