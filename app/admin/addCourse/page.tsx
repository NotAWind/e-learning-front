"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays, CircleHelp, Trash2 } from "lucide-react";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const tagsOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const TAGSOPTIONS: Option[] = [
  { label: "Math", value: "Math" },
  { label: "Language", value: "Language" },
  { label: "Computer", value: "Computer" },
  { label: "Bussiness", value: "Bussiness" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Physics", value: "Physics" },
];

const profileFormSchema = z.object({
  courseTitle: z.string().min(1, {
    message: "Course name can not be empty.",
  }),
  introduction: z
    .string()
    .min(10, {
      message: "Introduction must be at least 10 characters.",
    })
    .max(1000, {
      message: "Introduction must not be longer than 30 characters.",
    }),
  cover: z.object({
    images: z
      .any()
      .refine(
        (files) => {
          return Array.from(files).every((file) => file instanceof File);
        },
        { message: "Expected a file" }
      )
      .refine(
        (files) =>
          Array.from(files).every((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file?.type)
          ),
        "Only these types are allowed .jpg, .jpeg, .png and .webp"
      ),
  }),
  teacher: z.string().min(1, {
    message: "please fill in at least one teacher!",
  }),
  startTime: z.date({
    required_error: "A date of birth is required.",
  }),
  type: z.string({
    required_error: "Please select the course's type to display.",
  }),
  tags: z.array(tagsOptionSchema).min(1),
  weeklyCourses: z
    .array(
      z.object({
        value: z.string().optional(),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {};

export default function AddCourse() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "weeklyCourses",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about this course"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly introduce the main content of the course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover</FormLabel>
              <FormControl>
                <Input type="file" multiple {...field} />
              </FormControl>
              <FormDescription>upload course'cover</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <FormControl>
                <Input placeholder="teacher's name" {...field} />
              </FormControl>
              <FormDescription>
                The instructors of the course, if there are multiple, separate
                the names with commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the course' stype" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Live Stream">Live Stream</SelectItem>
                  <SelectItem value="Record">Record</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={TAGSOPTIONS}
                  placeholder="Select the category of the course"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                Select the category of the course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mr-4">
            Weekly Course
          </h3>
          <Button type="button" onClick={() => append({ value: "" })}>
            Add Week
          </Button>
        </div>

        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {fields.map((field, index) => (
            <li key={`week-${index + 1}`} className="mb-10 ms-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button type="button" variant="ghost">
                      Week {index + 1}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[700px] sm:max-w-[700px]">
                    <SheetHeader>
                      <SheetTitle>Edit Weekly Course</SheetTitle>
                      <SheetDescription>
                        Make changes to the weekly course here. Click save when
                        you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="theme" className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Theme</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  This week's course topic/title
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input className="col-span-3" />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="live stream link"
                          className="text-right"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Live Stream Link</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  If this week's course type is a live stream,
                                  fill in the live stream link here
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input className="col-span-3" />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="record video" className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Record Video</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  If this week's course type is a recorded
                                  video, upload the recorded video here
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input type="file" className="col-span-3" />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="summary" className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Summary</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  Briefly summarize this week's course
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Textarea className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="key Words" className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Key Words</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  Enter the keywords for this week's course,
                                  separated by commas if there are multiple
                                  keywords
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Textarea className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="materials" className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center ml-auto">
                                <span className="mr-2">Materials</span>
                                <CircleHelp size={20} color="#64748b" />
                              </TooltipTrigger>
                              <TooltipContent className="w-72">
                                <p className="text-sm text-muted-foreground text-left">
                                  Upload additional study materials or other
                                  files
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input type="file" className="col-span-3" />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <Button
                  className="ml-2"
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </h3>
            </li>
          ))}
        </ol>

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
