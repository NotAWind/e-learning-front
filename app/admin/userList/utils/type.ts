export type School = {
  schoolId: string;
  schoolName: string;
};

export type User = {
  id: string;
  userName: string;
  email: string;
  schools: School[];
  role: "teacher" | "student" | "admin";
  password: string;
  avatar: string;
};
