import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthStatusPanel } from "@/components/auth/AuthStatusPanel";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <AuthBackground />
      <h1 className="text-3xl font-semibold tracking-tight text-aluminum-900 sm:text-4xl">
        Welcome to EduTech
      </h1>
      <p className="max-w-md text-aluminum-500">
        A gamified learning platform. Sign in or create an account to continue.
      </p>
      <AuthStatusPanel />
    </main>
  );
}
