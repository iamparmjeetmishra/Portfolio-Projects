"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { SignUpFormInferSchema, SignUpFormSchema } from "@/lib/validations";

// import { SignUpAction } from "./auth-action";

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormInferSchema>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // submit handler
  async function FormHandler(values: SignUpFormInferSchema) {
    try {
      console.log("before signup");
      const res = await axiosInstance.post(`/api/register`, values);
      console.log("FormHandler", res);
      const data = await res.data;
      const jwt = data.jwt;
      if (jwt) {
        localStorage.setItem("nexttodotoken", jwt);
        toast.success("User is created with jwt", jwt);
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Err Signup', ${error.message}`);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle>Begin your journey</CardTitle>
        <CardDescription>Sign up to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(FormHandler)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name.."
                      {...field}
                    />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-start">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
