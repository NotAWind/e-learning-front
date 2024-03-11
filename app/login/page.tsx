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

export default function Login() {
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
                  defaultValue="card"
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                      aria-label="Card"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <School color="green" size={48} />
                      Admin/Teacher
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="stuent"
                      id="stuent"
                      className="peer sr-only"
                      aria-label="Stuent"
                    />
                    <Label
                      htmlFor="stuent"
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
                <Input id="email" placeholder="Email" type="email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input id="password" placeholder="Password" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
