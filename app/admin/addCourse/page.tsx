"use client";

import CourseForm from "../components/course-form";
import { RequestPrefix } from "@/app/utils/request";
import { useToast } from "@/components/ui/use-toast";

const AddCourse = () => {
  const { toast } = useToast();

  const onSubmit = (data: any) => {
    fetch(`${RequestPrefix}/course-list`, {
      method: "POST",
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
        console.log("Course added:", data);
      });
  };

  return <CourseForm initialData={{}} onSubmit={onSubmit} />;
};

export default AddCourse;
