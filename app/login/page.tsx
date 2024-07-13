"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import style from "./page.module.css";
import { Label } from "@/components/ui/label";
import { School, User, LogIn } from "lucide-react";
import { RequestPrefix } from "@/app/utils/request";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const { toast } = useToast();

  const handleLogin = async (e: any) => {
    const response = await fetch(
      `${RequestPrefix}/users?email=${email}&password=${password}`
    );

    console.log(response);
    const users = await response.json();

    if (users.length > 0) {
      const user = users[0];
      if (role === "student" && user.role === role) {
        alert(`Welcome student`);
      } else if (role === "admin" && user.role === "teacher") {
        alert(`Welcome teacher`);
      } else if (role === "admin" && user.role === "admin") {
        alert(`Welcome admin`);
      } else {
        alert("Incorrect role");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Invalid email or password",
        className: "z-10",
      });
    }
  };

  return (
    <main className={style.main}>
      <div className={style.logo}>
        <Image
          className={style.logoImg}
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          priority
        />
        <div className={style.logoText}>E-LEARN</div>
      </div>
      <Card className={style.card}>
        <CardHeader>
          <CardTitle>Welcome to E-Learn</CardTitle>
          <CardDescription>Please Fill the Form to Login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <RadioGroup
                  defaultValue="admin"
                  className="grid grid-cols-3 gap-4"
                  onValueChange={setRole}
                >
                  <div>
                    <RadioGroupItem
                      value="admin"
                      id="admin"
                      className="peer sr-only"
                      aria-label="Admin"
                    />
                    <Label
                      htmlFor="admin"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <School color="green" size={48} />
                      Admin/Teacher
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="student"
                      id="student"
                      className="peer sr-only"
                      aria-label="Student"
                    />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
                    >
                      <User color="green" size={48} />
                      Student
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
