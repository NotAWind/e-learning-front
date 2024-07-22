"use client";

import { useEffect, useState } from "react";
import CourseForm from "../components/course-form";
import { RequestPrefix } from "@/app/utils/request";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const CourseDetails = () => {
  const [courseData, setCourseData] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${RequestPrefix}/course-list/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCourseData({
          ...data,
          startTime: new Date(data.startTime),
          cover: null,
        });
      });
  }, [id]);

  const onSubmit = (data: any) => {
    fetch(`${RequestPrefix}/course-list/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Successful!",
          description: `The course with id ${id} has been successfully updated!`,
        });
        console.log("Course updated:", data);
      });
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return <CourseForm initialData={courseData} onSubmit={onSubmit} />;
};

export default CourseDetails;
