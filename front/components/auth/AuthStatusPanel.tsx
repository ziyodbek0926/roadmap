"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { clearAuthToken, getAuthToken, subscribeToAuthToken } from "@/lib/auth-storage";

export function AuthStatusPanel() {
  const hasToken = useSyncExternalStore(
    subscribeToAuthToken,
    () => Boolean(getAuthToken()),
    () => false // server snapshot: always render signed-out during SSR
  );

  if (hasToken) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-aluminum-600">You&apos;re signed in.</p>
        <button
          onClick={() => clearAuthToken()}
          className="rounded-full border border-brown-300 px-5 py-2 text-sm font-medium text-brown-600 transition hover:bg-brown-50"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Link
        href="/login"
        className="rounded-full bg-brown-500 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-brown-600"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="rounded-full border border-brown-300 px-5 py-2 text-sm font-medium text-brown-600 transition hover:bg-brown-50"
      >
        Create account
      </Link>
    </div>
  );
}
