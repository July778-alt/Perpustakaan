"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}) {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(formData) {
    setError("");

    const response = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password")
    })

    if (response.error) {
      setError("Email atau password salah");
      return
    }

    const session = await fetch("/api/auth/session").then((res) => res.json());
    
    if (session?.user?.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/home")
    }
  } 

  return (
    <form action={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Welcome back! Enter your email and password bellow to log in.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" name="email" placeholder="Enter your email" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input id="password" type="password" name="password" placeholder="Enter your password" required />
        </Field>
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <Field>
          <Button type="submit" className="font-semibold">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}