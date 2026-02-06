import { Flashcard } from "../types.ts";

const AUTH_TOKEN_KEY = "eduboost_auth_token";
export type UserRole = "student" | "professor";
export type EvernoteNote = {
  id: string;
  courseId: string;
  title: string;
  content: string;
  link?: string;
  createdAt: string;
};
export type LearningContentItem = {
  id: string;
  courseId: string;
  type: "PDF" | "LIEN";
  title: string;
  url: string;
  createdAt: string;
};

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

async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: buildHeaders(),
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

async function deleteJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(),
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

export async function listEvernoteNotes(courseId: string): Promise<EvernoteNote[]> {
  const response = await getJson<{ notes?: EvernoteNote[] }>(`/api/notes?courseId=${encodeURIComponent(courseId)}`);
  return response.notes || [];
}

export async function createEvernoteNote(payload: {
  courseId: string;
  title: string;
  content?: string;
  link?: string;
}): Promise<EvernoteNote> {
  const response = await postJson<{ note?: EvernoteNote }>("/api/notes", payload);
  if (!response.note) throw new Error("Impossible de créer la note.");
  return response.note;
}

export async function removeEvernoteNote(id: string): Promise<void> {
  await deleteJson<{ ok: boolean }>(`/api/notes/${encodeURIComponent(id)}`);
}

export async function listCourseContent(courseId: string): Promise<LearningContentItem[]> {
  const response = await getJson<{ resources?: LearningContentItem[] }>(`/api/resources?courseId=${encodeURIComponent(courseId)}`);
  return response.resources || [];
}

export async function createCourseContent(payload: {
  courseId: string;
  type: "PDF" | "LIEN";
  title: string;
  url: string;
}): Promise<LearningContentItem> {
  const response = await postJson<{ resource?: LearningContentItem }>("/api/resources", payload);
  if (!response.resource) throw new Error("Impossible de créer le contenu.");
  return response.resource;
}

export async function removeCourseContent(id: string): Promise<void> {
  await deleteJson<{ ok: boolean
