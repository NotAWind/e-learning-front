"use client";

import { useEffect, useState } from "react";
import CourseForm from "../components/course-form";
import { RequestPrefix } from "@/app/utils/request";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const CourseDetails = () => {
  const [courseData, setCourseData] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  useEffect(() => {
    fetch(`${RequestPrefix}/course-list/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCourseData(data["course-list"][0]);
      });
  }, []);

  const onSubmit = (data: any) => {
    console.log("post data", JSON.stringify(data));
    fetch(`${RequestPrefix}/course-list`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Successful!",
          description: `Add a Course Successfully!`,
        });
        console.log("Course updated:", data);
      });
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Course Details</h1>
      <CourseForm initialData={courseData} onSubmit={onSubmit} />
    </div>
  );
};

export default CourseDetails;
