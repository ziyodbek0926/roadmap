import axios, { AxiosError } from "axios";
import { getAuthToken } from "@/lib/auth-storage";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  full_name: string;
  phone_number: string;
  region: string;
  email: string | null;
  is_active: boolean;
}

export async function registerUser(payload: RegisterFormValues): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: LoginFormValues): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>("/auth/login", payload);
  return data;
}

export async function getCurrentUser(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/auth/me");
  return data;
}

interface FastAPIErrorBody {
  detail?: string | { msg: string }[];
}

/**
 * FastAPI shapes error bodies as { detail: string } for our own
 * HTTPExceptions, or { detail: [{ msg: string }, ...] } for Pydantic's
 * automatic 422 validation errors -- normalize both into one string.
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as FastAPIErrorBody | undefined)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
