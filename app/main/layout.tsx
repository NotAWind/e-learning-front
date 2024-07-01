import * as React from "react";
import Header from "./components/header/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mt-[69px]">{children}</div>
    </>
  );
}
