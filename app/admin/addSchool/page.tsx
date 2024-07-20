"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RequestPrefix } from "@/app/utils/request";
import { useToast } from "@/components/ui/use-toast";

const API_URL = `${RequestPrefix}/schools`;

const formSchema = z.object({
  schoolName: z.string().min(1, {
    message: "School Name can not be empty",
  }),
});

export default function AddSchool() {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
    },
    mode: "onChange",
  });
  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.schoolName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      toast({
        title: "Successful!",
        description: `Add School ${data.schoolName} Successfully!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to add school: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="schoolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input placeholder="Please enter school's name" {...field} />
              </FormControl>
              <FormDescription>{`This is the school's name.`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={loading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
