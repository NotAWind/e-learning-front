"use client";

import { useEffect, useState } from "react";
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
import { RequestPrefix } from "@/app/utils/request";

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

const schoolOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const weeklyCourseSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  liveStreamLink: z.string().url().optional(),
  recordVideo: z.instanceof(File).optional(),
  summary: z.string().optional(),
  keyWords: z.string().optional(),
  materials: z.instanceof(File).optional(),
});

const courseFormSchema = z.object({
  courseTitle: z.string().min(1, {
    message: "Course name cannot be empty.",
  }),
  introduction: z
    .string()
    .min(10, {
      message: "Introduction must be at least 10 characters.",
    })
    .max(1000, {
      message: "Introduction must not be longer than 1000 characters.",
    }),
  cover: z.instanceof(File).refine((file) => file.size > 0, {
    message: "File size must be greater than 0",
  }),
  teacher: z.string().min(1, {
    message: "Please fill in at least one teacher!",
  }),
  startTime: z.date({
    required_error: "A start time is required.",
  }),
  type: z.string({
    required_error: "Please select the course's type to display.",
  }),
  tags: z.array(tagsOptionSchema).min(1),
  weeklyCourses: z.array(weeklyCourseSchema).optional(),
  schools: z.array(schoolOptionSchema).min(1),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: Partial<CourseFormValues> = {};

export default function AddCourse() {
  const [schoolOptions, setSchoolOptions] = useState<Option[]>([]);
  const [tagOptions, setTagOptions] = useState<Option[]>([]);
  const [courses, setCourses] = useState<CourseFormValues[]>([]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "weeklyCourses",
    control: form.control,
  });

  useEffect(() => {
    fetch(`${RequestPrefix}/schools`)
      .then((response) => response.json())
      .then((data) => {
        const schoolOptionsFromAPI = data.map((school: any) => ({
          label: school.name,
          value: school.name,
        }));
        setSchoolOptions(schoolOptionsFromAPI);
      });

    fetch(`${RequestPrefix}/tags`)
      .then((response) => response.json())
      .then((data) => {
        const tagOptionsFromAPI = data.map((tag: any) => ({
          label: tag.label,
          value: tag.value,
        }));
        setTagOptions(tagOptionsFromAPI);
      });
  }, []);

  function onSubmit(data: CourseFormValues) {
    setCourses([...courses, data]);
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
              <FormLabel>Introduction</FormLabel>
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
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e?.target?.files?.[0])}
                />
              </FormControl>
              <FormDescription>Upload course cover</FormDescription>
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
                    <SelectValue placeholder="Select the course's type" />
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
                  options={tagOptions}
                  placeholder="Select the category of the course"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      No results found.
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
        <FormField
          control={form.control}
          name="schools"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schools</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  options={schoolOptions}
                  placeholder="Select the school"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                Select the school to which this course belongs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mr-4">
            Weekly Course
          </h3>
          <Button type="button" onClick={() => append({ theme: "" })}>
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
                        {`Make changes to the weekly course here. Click save when
                        you're done.`}
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
                                  {`This week's course topic/title`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.theme`}
                          render={({ field }) => (
                            <Input {...field} className="col-span-3" />
                          )}
                        />
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
                                  {`If this week's course type is a live stream,
                                  fill in the live stream link here`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.liveStreamLink`}
                          render={({ field }) => (
                            <Input {...field} className="col-span-3" />
                          )}
                        />
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
                                  {`If this week's course type is a recorded
                                  video, upload the recorded video here`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.recordVideo`}
                          render={({ field }) => (
                            <Input
                              type="file"
                              className="col-span-3"
                              onChange={(e) =>
                                field.onChange(e?.target?.files?.[0])
                              }
                            />
                          )}
                        />
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
                                  {`Briefly summarize this week's course`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.summary`}
                          render={({ field }) => (
                            <Textarea {...field} className="col-span-3" />
                          )}
                        />
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
                                  {` Enter the keywords for this week's course,
                                  separated by commas if there are multiple
                                  keywords`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.keyWords`}
                          render={({ field }) => (
                            <Textarea {...field} className="col-span-3" />
                          )}
                        />
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
                        <FormField
                          control={form.control}
                          name={`weeklyCourses.${index}.materials`}
                          render={({ field }) => (
                            <Input
                              type="file"
                              className="col-span-3"
                              onChange={(e) =>
                                field.onChange(e?.target?.files?.[0])
                              }
                            />
                          )}
                        />
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

        <Button type="submit">Add Course</Button>
      </form>
    </Form>
  );
}
