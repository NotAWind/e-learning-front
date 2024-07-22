"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RequestPrefix } from "@/app/utils/request";
import Image from "next/image";

interface User {
  name: string;
  avatar: string;
}

interface Comment {
  id: number;
  courseId: number;
  user: User;
  content: string;
  postTime: string;
  rating: number;
}

const fetchComments = async (
  courseId: string | string[]
): Promise<Comment[]> => {
  const response = await fetch(
    `${RequestPrefix}/comments?courseId=${courseId}`
  );
  const data = await response.json();
  return data;
};

const CourseComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (courseId) {
      fetchComments(courseId).then(setComments);
    }
  }, [courseId]);

  if (!courseId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {!comments?.length && (
        <div className="flex flex-col items-center">
          <Image
            className="pr-2"
            src="/no-data-illustration.jpg"
            alt="no data"
            width={400}
            height={400}
            priority
          />

          <div>Empty Data!</div>
        </div>
      )}
      {comments?.length > 0 &&
        comments.map((comment) => (
          <Card key={comment.id} className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={comment.user.avatar}
                    alt={`${comment.user.name}'s avatar`}
                  />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{comment.user.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(comment.postTime), "yyyy-MM-dd HH:mm")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{comment.content}</p>
              <div className="flex items-center">
                <span className="mr-2 text-yellow-500">
                  {"⭐️".repeat(comment.rating)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default CourseComments;
