"use client";
import * as React from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecordDetail() {
  return (
    <>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        controls={true}
        width="100%"
        height="90vh"
      />
      <Card className="m-10">
        <CardHeader>
          <CardTitle>Materials</CardTitle>
          <CardDescription>
            You have 3 study materials available for download.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {[1, 2, 3, 4].map((material, index) => (
              <div
                key={index}
                className="justify-items-start mb-4 grid grid-cols-[25px_1fr] items-center last:mb-0"
              >
                <span className="flex h-2 w-2 rounded-full bg-sky-500" />
                <Button
                  variant="link"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Material {material}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
