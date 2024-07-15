"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, University } from "lucide-react";
import { RequestPrefix } from "@/app/utils/request";
import { debounce } from "@/app/utils/debounce";
import style from "./page.module.css";

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
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${RequestPrefix}/courses`);
      const data: Course[] = await response.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.university.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
    <div className={`px-5 mt-[80px]`}>
      <div className={`grid grid-cols-3 gap-x-1 gap-y-2.5 max-w-[650px]`}>
        <Input
          className={"col-span-3"}
          type="search"
          placeholder="Search"
          onChange={handleSearchChange}
        />
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-screen-xl py-8 gap-5`}
      >
        {filteredCourses.map((course) => (
          <Link key={course.id} href={"/main/courseDetail"}>
            <Card className="w-full overflow-hidden relative cursor-pointer">
              <img
                className="object-cover h-56 w-full"
                src={course.image}
                alt={course.title}
              />
              <span
                className={`${style.courseType} text-xs py-0.5 px-2.5 absolute top-0 right-0`}
              >
                {course.type}
              </span>
              <CardHeader>
                <div className="flex items-center ">
                  <University size={28} color="green" absoluteStrokeWidth />
                  <span className="pl-2 line-clamp-2 text-muted-foreground text-sm">
                    {course.university}
                  </span>
                </div>
                <CardTitle className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm ">
                  <span className="pr-1">{course.rating}</span>
                  <Star size={16} fill="green" color="green" />
                  <span className="pl-1 text-muted-foreground">
                    ({course.reviews})
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {course.tags.join("·")}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
