"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RequestPrefix } from "@/app/utils/request";

interface Material {
  id: number;
  name: string;
  url: string;
}

interface RecordDetailData {
  videoUrl: string;
  materials: Material[];
}

export default function RecordDetail() {
  const [data, setData] = useState<RecordDetailData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${RequestPrefix}/record-detail`);
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <Spinner size="large" />;
  }

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    alert(url);
    link.download = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ReactPlayer
        url={data.videoUrl}
        controls={true}
        width="100%"
        height="90vh"
      />
      <Card className="m-10">
        <CardHeader>
          <CardTitle>Materials</CardTitle>
          <CardDescription>
            You have {data.materials.length} study materials available for
            download.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {data.materials.map((material) => (
              <div
                key={material.id}
                className="justify-items-start mb-4 grid grid-cols-[25px_1fr] items-center last:mb-0"
              >
                <span className="flex h-2 w-2 rounded-full bg-sky-500" />
                <Button
                  variant="link"
                  className="text-sm font-medium leading-none cursor-pointer"
                  onClick={() => handleDownload(material.url)}
                >
                  {material.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
