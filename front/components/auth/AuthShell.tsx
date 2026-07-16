import type { ReactNode } from "react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { GlassCard } from "@/components/auth/GlassCard";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      <AuthBackground />
      <GlassCard>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-aluminum-900">{title}</h1>
          <p className="mt-2 text-sm text-aluminum-500">{subtitle}</p>
        </div>
        {children}
        {footer ? <p className="mt-8 text-center text-sm text-aluminum-500">{footer}</p> : null}
      </GlassCard>
    </div>
  );
}
