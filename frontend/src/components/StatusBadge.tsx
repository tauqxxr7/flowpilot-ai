const styles: Record<string, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  auto_resolve: "border-emerald-200 bg-emerald-50 text-emerald-700",
  create_ticket: "border-blue-200 bg-blue-50 text-blue-700",
  escalate_to_human: "border-red-200 bg-red-50 text-red-700",
  send_follow_up: "border-cyan-200 bg-cyan-50 text-cyan-700",
  mark_high_risk_customer: "border-orange-200 bg-orange-50 text-orange-700",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[value] ?? "border-gray-200 bg-gray-50 text-gray-700"}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}
