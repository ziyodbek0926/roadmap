"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/ui/FormField";
import { RegionSelect } from "@/components/ui/RegionSelect";
import { GooeyButton } from "@/components/ui/GooeyButton";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { extractErrorMessage, loginUser, registerUser } from "@/lib/api";
import { saveAuthToken } from "@/lib/auth-storage";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", phone_number: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser(values);
      // /auth/register doesn't itself return a token, so log the new user
      // straight in for a one-step signup -> authenticated flow.
      const { access_token } = await loginUser({
        phone_number: values.phone_number,
        password: values.password,
      });
      saveAuthToken(access_token);
      router.push("/");
    } catch (error) {
      setServerError(extractErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField
        label="Full name"
        placeholder="Aziza Karimova"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register("full_name")}
      />
      <FormField
        label="Phone number"
        placeholder="+998901234567"
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone_number?.message}
        {...register("phone_number")}
      />
      <RegionSelect label="Region" defaultValue="" error={errors.region?.message} {...register("region")} />
      <FormField
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p> : null}

      <GooeyButton isLoading={isSubmitting}>Create account</GooeyButton>
    </form>
  );
}
