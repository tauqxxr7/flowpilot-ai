type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <section className="surface rounded-md p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-3 font-mono text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-gray-600">{detail}</p>
    </section>
  );
}
