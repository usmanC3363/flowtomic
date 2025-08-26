"use client";

import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EditUserProfileSchema } from "@/src/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2Icon, Loader2 } from "lucide-react";

type Props = {
  // user: any;
  // onUpdate?: any;
};

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: "onChange",
    // coming from types.ts
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      // name: user.name,
      // email: user.email,
    },
  });

  // const handleSubmit = async (
  //   values: z.infer<typeof EditUserProfileSchema>,
  // ) => {
  //   setIsLoading(true);
  //   await onUpdate(values.name);
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   form.reset({ name: user.name, email: user.email });
  // }, [user]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={() => {}}
        // onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">User full name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
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
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={true}
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="group self-start transition-all duration-100 ease-linear hover:bg-[#2F006B] hover:text-white"
        >
          {false ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <span className="transition-all duration-150 ease-linear">
              Save User Settings
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
