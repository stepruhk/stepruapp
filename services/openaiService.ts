import { Flashcard } from "../types.ts";

const AUTH_TOKEN_KEY = "eduboost_auth_token";
export type UserRole = "student" | "professor";

type ApiErrorShape = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
    requestId?: string | null;
  } | string;
};

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function postJson<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiErrorShape & T;
  if (!response.ok) {
    if (typeof data?.error === "string") {
      throw new Error(data.error);
    }
    const code = data?.error?.code ? `[${data.error.code}] ` : "";
    const message = data?.error?.message || "Request failed";
    throw new Error(`${code}${message}`);
  }
  return data as T;
}

export async function loginWithPassword(password: string, role: UserRole = "student"): Promise<UserRole> {
  const endpoint = role === "professor" ? "/api/auth/prof-login" : "/api/auth/login";
  const response = await postJson<{ token?: string; role?: UserRole }>(endpoint, { password });
  if (!response.token) {
    throw new Error("Réponse de connexion invalide.");
  }
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  return response.role || role;
}

export async function checkAuthStatus(): Promise<{ authenticated: boolean; role: UserRole }> {
  const response = await fetch("/api/auth/status", {
    method: "GET",
    headers: buildHeaders(),
  });
  const data = (await response.json()) as { authenticated?: boolean; role?: UserRole };
  return {
    authenticated: Boolean(data?.authenticated),
    role: data?.role || "student",
  };
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export const summarizeContent = async (content: string): Promise<string> => {
  const response = await postJson<{ summary?: string }>("/api/summarize", {
    content,
  });
  return response.summary || "Impossible de generer un resume.";
};

export const generateFlashcards = async (content: string): Promise<Flashcard[]> => {
  const response = await postJson<{ flashcards?: Flashcard[] }>("/api/flashcards", {
    content,
  });
  return response.flashcards || [];
}

export const generatePodcastAudio = async (text: string): Promise<string> => {
  const response = await postJson<{ audioDataUrl?: string }>("/api/podcast", {
    text,
  });
  if (!response.audioDataUrl) throw new Error("Failed to generate audio");
  return response.audioDataUrl;
};
