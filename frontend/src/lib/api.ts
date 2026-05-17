export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const BACKEND_WAKE_MESSAGE =
  "Backend is waking up. Please wait 30-60 seconds and try again.";

export class FlowPilotApiError extends Error {
  status?: number;
  isWakeup: boolean;

  constructor(message: string, status?: number, isWakeup = false) {
    super(message);
    this.name = "FlowPilotApiError";
    this.status = status;
    this.isWakeup = isWakeup;
  }
}

export type SourceSnippet = {
  id: string;
  title: string;
  source: string;
  category: string;
  snippet: string;
  score: number;
};

export type WorkflowDecision = {
  action: string;
  confidence: number;
  reason: string;
  owner: string;
  priority: string;
};

export type DecisionTimelineItem = {
  step: number;
  title: string;
  description: string;
  status: string;
  metadata: Record<string, string | number | string[]>;
  timestamp: string;
};

export type QueryResponse = {
  ticket_id: string;
  intent: string;
  confidence: number;
  response: string;
  sources: SourceSnippet[];
  workflow: WorkflowDecision;
  decision_timeline: DecisionTimelineItem[];
};

export type Ticket = {
  id: string;
  customer_name: string;
  channel: string;
  message: string;
  intent: string;
  confidence: number;
  response: string;
  action: string;
  priority: string;
  owner: string;
  response_time_seconds: number;
  created_at: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  source: string;
  category: string;
  content: string;
  created_at: string;
};

export type DashboardStats = {
  total_tickets: number;
  resolved_by_ai: number;
  escalated_tickets: number;
  average_response_time_seconds: number;
  average_confidence: number;
  confidence_distribution: Record<string, number>;
  category_breakdown: Record<string, number>;
  recent_activity: Array<Record<string, string>>;
};

function isWakeupStatus(status: number) {
  return status === 502 || status === 503 || status === 504;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof FlowPilotApiError) {
    return error.message;
  }
  return BACKEND_WAKE_MESSAGE;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new FlowPilotApiError(BACKEND_WAKE_MESSAGE, undefined, true);
  }

  if (!response.ok) {
    const isWakeup = isWakeupStatus(response.status);
    throw new FlowPilotApiError(
      isWakeup ? BACKEND_WAKE_MESSAGE : `FlowPilot API returned ${response.status}. Please try again.`,
      response.status,
      isWakeup,
    );
  }

  return response.json() as Promise<T>;
}

export function getHealth(): Promise<{ status: string; service: string }> {
  return request<{ status: string; service: string }>("/health");
}

export function submitQuery(message: string, customerName = "Acme Operations"): Promise<QueryResponse> {
  return request<QueryResponse>("/api/query", {
    method: "POST",
    body: JSON.stringify({ message, customer_name: customerName, channel: "web" }),
  });
}

export function getStats(): Promise<DashboardStats> {
  return request<DashboardStats>("/api/dashboard/stats");
}

export function getTickets(): Promise<Ticket[]> {
  return request<Ticket[]>("/api/tickets");
}

export function getDocuments(): Promise<DocumentRecord[]> {
  return request<DocumentRecord[]>("/api/documents");
}

export async function uploadDocument(file: File): Promise<{ id: string; status: string; filename: string }> {
  const body = new FormData();
  body.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: "POST",
      body,
    });
  } catch {
    throw new FlowPilotApiError(BACKEND_WAKE_MESSAGE, undefined, true);
  }

  if (!response.ok) {
    const isWakeup = isWakeupStatus(response.status);
    throw new FlowPilotApiError(
      isWakeup ? BACKEND_WAKE_MESSAGE : `FlowPilot upload returned ${response.status}. Please try again.`,
      response.status,
      isWakeup,
    );
  }

  return response.json() as Promise<{ id: string; status: string; filename: string }>;
}

export function routeWorkflow(payload: { intent: string; confidence: number; message: string }): Promise<WorkflowDecision> {
  return request<WorkflowDecision>("/api/workflows/route", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
