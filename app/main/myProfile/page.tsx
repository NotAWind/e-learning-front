"use client";
import React, { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RequestPrefix } from "@/app/utils/request";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  avatar: z.instanceof(File).refine((file) => file.size > 0, {
    message: "File size must be greater than 0",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  username: "",
  email: "",
};

function ProfileForm() {
  const [profile, setProfile] = useState<ProfileFormValues | null>(null);

  useEffect(() => {
    fetch(`${RequestPrefix}/users/00001`)
      .then((response) => response.json())
      .then((data) => {
        setProfile({
          username: data.userName,
          email: data.email,
          avatar: new File([], data.avatar),
        });
      });
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile || defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("avatar", data.avatar);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input placeholder="your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input placeholder="please enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Avatar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e?.target?.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          Update profile
        </Button>
      </form>
    </Form>
  );
}

export default function MyProfile() {
  return (
    <div className="overflow-scroll bg-[url('/profile-bg.jpg')] h-screen-minus-69 w-screen bg-cover flex justify-center items-center">
      <div className="space-y-6 backdrop-blur-3xl bg-white/30 pt-16 pb-28 px-16 rounded-xl shadow-2xl">
        <div>
          <h3 className="text-lg font-medium text-white">Profile</h3>
          <p className="text-sm text-slate-200">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </div>
  );
}
