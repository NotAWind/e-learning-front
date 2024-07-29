"use client";

import React, { useEffect, useState } from "react";
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
  const role = session?.role;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || role !== "student") {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [session, router, role]);

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <Header />
      <div className="mt-[69px]">{children}</div>
    </>
  );
}
