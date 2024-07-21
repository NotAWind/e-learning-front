export interface School {
  id: string;
  name: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  schools: School[];
  role: "teacher" | "student" | "admin";
  password: string;
  avatar: string;
}
