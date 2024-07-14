"use client";

import React, { useEffect } from "react";
import Header from "./components/header/header";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/contexts/sessionContext";
import { Spinner } from "@/components/ui/spinner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const router = useRouter();

  console.log("session", session);

  useEffect(() => {
    // if (!session) {
    //   router.push("/login");
    // }
  }, [session, router]);

  // if (!session) {
  //   return <Spinner size="large" />;
  // }
  return (
    <>
      <Header />
      <div className="mt-[69px]">{children}</div>
    </>
  );
}
