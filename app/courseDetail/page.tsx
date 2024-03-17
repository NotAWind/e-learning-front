"use client";

import Header from "@/components/header/header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play } from "lucide-react";

export default function CourseDetail() {
  return (
    <div className="mb-10">
      <Header></Header>
      <div className="grid grid-cols-7 bg-green-50 mt-[69px]">
        <div className="col-start-1 col-end-5 p-8 ">
          <div className="font-semibold text-5xl">Data Analysis</div>
          <div className="font-mono text-lg mt-8 min-h-[250px] text-neutral-500">
            Welcome to Analysis! This course delves into fundamental
            mathematical principles like calculus, sequences, series, and
            functions. Get ready to sharpen problem-solving skills and explore
            precise reasoning. Whether for advanced studies or deeper
            understanding, this course lays a solid mathematical foundation. Let
            us begin this journey together!
          </div>
          <div className="mt-8">Teacher: Mick Green, Joe</div>
          <Button className="mt-10 text-white">Register</Button>
        </div>
        <div className="relative col-start-5 col-end-8">
          <Image
            src="/data-analysis-cover.jpg"
            alt="course cover"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <Tabs defaultValue="detail" className="w-screen">
        <TabsList className="grid grid-cols-7 bg-green-100">
          <TabsTrigger className="col-start-3 col-end-4" value="detail">
            Detail
          </TabsTrigger>
          <TabsTrigger className="col-start-5 col-end-6" value="overview">
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <Accordion className="mx-8" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Week 1</AccordionTrigger>
              <AccordionContent>
                <div className="flex">
                  <div className="relative w-[100px] h-[100px] relative cursor-pointer">
                    <Image
                      className="rounded-xl"
                      src="/flower.jpg"
                      alt="course cover"
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <div className="p-1.5 rounded-full absolute top-[34px] left-[34px] backdrop-blur-md bg-zinc-500/50">
                      <Play size={20} color="white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 ml-7">
                    <div className="text-sm font-semibold">
                      Week 1 Course Theme
                    </div>
                    <div className="text-xs text-slate-500 my-2 min-h-[50px] line-clamp-3">
                      Week 1 Course description. For example, Introduction to
                      Basics: Covering fundamental concepts essential for
                      understanding advanced topics in the field. Includes
                      lectures, readings, and introductory assignments.
                    </div>
                    <div className="text-xs text-slate-500 my-2">
                      #key word1#&nbsp;&nbsp;#key word2#&nbsp;&nbsp;#key word3#
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Week 2</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Week 3</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Week 4</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="overview">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
