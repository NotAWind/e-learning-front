import CourseList from "../components/courseList/courseList";
import { RequestPrefix } from "@/app/utils/request";

export default function Home() {
  return <CourseList fetchUrl={`${RequestPrefix}/finished-courses`} />;
}
