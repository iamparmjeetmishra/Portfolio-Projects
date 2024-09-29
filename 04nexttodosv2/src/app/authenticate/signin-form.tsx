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
import { SignInFormInferSchema, SignInFormSchema } from "@/lib/validations";
import { useUserStore } from "@/store/user-store";

export default function SignInForm() {
  const router = useRouter();
  const signIn = useUserStore((state) => state.signIn);
  const form = useForm<SignInFormInferSchema>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // submit handler
  async function FormHandler(values: SignInFormInferSchema) {
    try {
      const res = await axiosInstance.post(`/api/login`, values);
      const data = await res.data;
      console.log("datafrom signin", data);

      //
      if (data.jwt) {
        localStorage.setItem("nexttodotoken", data.jwt);
        toast.success("Successfully Logged in");
        router.push("/dashboard");
      } else {
        toast.error(`${res.data.message}`);
      }
      signIn(data.user);
    } catch (error) {
      console.log("Err creating todo", error);
    }
  }

  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(FormHandler)}
          >
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
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
