"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play, Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { RequestPrefix } from "@/app/utils/request";
import { Spinner } from "@/components/ui/spinner";

interface Week {
  week: number;
  title: string;
  description: string;
  keywords: string[];
  image: string;
}

interface Comment {
  userName: string;
  avatar: string;
  rating: number;
  time: string;
  comment: string;
}

interface Course {
  id: number;
  image: string;
  type: string;
  university: string;
  title: string;
  description: string;
  rating: number;
  reviews: string;
  tags: string[];
  courseStatus: "notRegister" | "registered";
  weeks: Week[];
  comments: Comment[];
  teachers: string[];
}

export default function CourseDetail() {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await fetch(`${RequestPrefix}/course-detail`);
      const data = await response.json();
      setCourse(data);
    };

    fetchCourse();
  }, []);

  const handleRegister = () => {
    // An API call should be added to update the student's course status in the database.

    if (course && course.courseStatus === "notRegister") {
      setCourse({ ...course, courseStatus: "registered" });
    }
  };

  if (!course) {
    return <Spinner size="large" />;
  }

  const isRegisterable = course.courseStatus === "notRegister";

  return (
    <>
      <div className="grid grid-cols-7 bg-green-50 mt-[69px]">
        <div className="col-start-1 col-end-5 p-8 ">
          <div className="font-semibold text-5xl">{course.title}</div>
          <div className="font-mono text-lg mt-8 min-h-[250px] text-neutral-500">
            {course.description}
          </div>
          <div className="mt-8">Teacher: {course.teachers.join(" & ")}</div>
          <Button
            className="mt-10 text-white"
            onClick={handleRegister}
            disabled={!isRegisterable}
          >
            {course.courseStatus === "notRegister" && "Register"}
            {course.courseStatus === "registered" && "Registered"}
          </Button>
        </div>
        <div className="relative col-start-5 col-end-8">
          <Image
            src={course.image}
            alt="course cover"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <Tabs defaultValue="detail" className="w-screen mb-10">
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
            {course.weeks.map((week) => (
              <AccordionItem key={week.week} value={`week-${week.week}`}>
                <AccordionTrigger>Week {week.week}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex">
                    <Link href={`/main/recordDetail/${week.week}`}>
                      <div className="relative w-[100px] h-[100px] relative cursor-pointer">
                        <Image
                          className="rounded-xl"
                          src={week.image}
                          alt={`week ${week.week} cover`}
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <div className="p-1.5 rounded-full absolute top-[34px] left-[34px] backdrop-blur-md bg-zinc-500/50">
                          <Play size={20} color="white" fill="white" />
                        </div>
                      </div>
                    </Link>

                    <div className="flex-1 ml-7">
                      <div className="text-sm font-semibold">{week.title}</div>
                      <div className="text-xs text-slate-500 my-2 min-h-[50px] line-clamp-3">
                        {week.description}
                      </div>
                      <div className="text-xs text-slate-500 my-2">
                        {week.keywords.map((keyword, index) => (
                          <span key={index}>#{keyword}&nbsp;&nbsp;</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="overview" className="px-8">
          <div className="flex my-10">
            <Card className="px-[65px] py-5 mr-11 flex flex-col items-center justify-center">
              <div className="text-2xl text-zinc-600 mb-3">
                {course.rating} out of 5
              </div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => index).map(
                  (value, _, arr) => (
                    <Star
                      size={20}
                      fill="rgb(245, 158, 11)"
                      color="rgb(245, 158, 11)"
                      key={`star-${value}`}
                      className={`${value < arr.length - 1 ? "mr-1" : ""}`}
                    />
                  )
                )}
              </div>
            </Card>
            <div className="flex-1">
              <div className="max-w-[500px]">
                {Array.from({ length: 5 }, (_, index) => index).map((value) => (
                  <div
                    key={`star-rate-${value}`}
                    className="text-slate-500 flex items-center mt-1.5"
                  >
                    <div className="mr-2 w-[55px]">
                      {value + 1}&nbsp;&nbsp;Star
                    </div>
                    <Progress
                      value={(value + 1) * 20}
                      className="flex-1 h-[6px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {course.comments.map((comment, index, arr) => (
              <div key={`comment-item-${index}`}>
                <div className="flex ">
                  <div className="flex flex-1 items-center">
                    <Avatar className="w-[50px] h-[50px]">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 ml-2">
                      <div className="text-sm mb-1.5">{comment.userName}</div>
                      <div className="flex">
                        {Array.from({ length: comment.rating }, (_, index) => (
                          <Star
                            size={16}
                            fill="rgb(245, 158, 11)"
                            color="rgb(245, 158, 11)"
                            key={`star-comment-${index}`}
                            className="mr-1"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} color="#94a3b8" />
                    <div className="ml-2 text-xs text-slate-500">
                      {comment.time}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-gray-500">{comment.comment}</div>
                {index < arr.length - 1 ? (
                  <Separator className="mt-5 mb-4" />
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
