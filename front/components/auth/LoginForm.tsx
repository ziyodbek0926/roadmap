"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/ui/FormField";
import { GooeyButton } from "@/components/ui/GooeyButton";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { extractErrorMessage, loginUser } from "@/lib/api";
import { saveAuthToken } from "@/lib/auth-storage";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone_number: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const { access_token } = await loginUser(values);
      saveAuthToken(access_token);
      router.push("/");
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField
        label="Phone number"
        placeholder="+998901234567"
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone_number?.message}
        {...register("phone_number")}
      />
      <FormField
        label="Password"
        type="password"
        placeholder="Your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p> : null}

      <GooeyButton isLoading={isSubmitting}>Sign in</GooeyButton>
    </form>
  );
}
