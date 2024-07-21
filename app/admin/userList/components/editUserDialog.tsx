"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RequestPrefix } from "@/app/utils/request";
import { useToast } from "@/components/ui/use-toast";
import { User, School } from "../utils/type";

interface EditUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

const schoolOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  school: z.array(schoolOptionSchema).min(1),
});

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      school: [],
    },
    mode: "onChange",
  });
  const { reset } = form;
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      reset({
        username: user.userName,
        email: user.email,
        role: user.role,
        school: user.schools.map((s) => ({
          label: s.name,
          value: s.id,
        })),
      });
    }
  }, [user, reset]);

  React.useEffect(() => {
    fetch(`${RequestPrefix}/schools`)
      .then((response) => response.json())
      .then((data: School[]) => {
        const schoolOptions: Option[] = data.map((school: School) => ({
          label: school.name,
          value: school.id,
        }));
        setOptions(schoolOptions);
      })
      .catch((error) => {
        console.error("Error fetching school options:", error);
      });
  }, []);

  function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);

    const updatedUser = {
      ...user,
      email: data.email,
      role: data.role,
      userName: data.username,
      schools: data.school.map((s) => ({
        id: s.value,
        name: s.label,
      })),
    };

    fetch(`${RequestPrefix}/users/${user?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);

        toast({
          title: "Successful!",
          description: `Updated User ${data.username} Successfully!`,
        });

        onSave(result);
        onClose();
      })
      .catch((error) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to update User: ${error}`,
        });
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter user's name" {...field} />
                  </FormControl>
                  <FormDescription>{`This is the user's name.`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter user's email" {...field} />
                  </FormControl>
                  <FormDescription>{`This is the user's email.`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the user's role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Different roles have different permissions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schools</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      options={options}
                      placeholder="Select the schools that the user has permission to view"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Selecting a school means the user has permission to view the
                    various courses or information published by that school.{" "}
                    <b>Not Applicable to Admin.</b>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={loading} type="submit">
              Update
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
