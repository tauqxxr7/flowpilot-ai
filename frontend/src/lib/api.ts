export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FlowPilot API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
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

  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(`FlowPilot upload error: ${response.status}`);
  }

  return response.json() as Promise<{ id: string; status: string; filename: string }>;
}

export function routeWorkflow(payload: { intent: string; confidence: number; message: string }): Promise<WorkflowDecision> {
  return request<WorkflowDecision>("/api/workflows/route", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
