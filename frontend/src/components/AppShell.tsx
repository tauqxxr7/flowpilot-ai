import { BarChart3, Database, GitBranch, Inbox, MessageSquareText } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Copilot", icon: MessageSquareText },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/knowledge-base", label: "Knowledge", icon: Database },
  { href: "/tickets", label: "Tickets", icon: Inbox },
  { href: "/workflow-lab", label: "Workflow Lab", icon: GitBranch },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-bold text-white shadow-sm">
              FP
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">FlowPilot AI</p>
              <p className="text-xs text-gray-500">AI workflow orchestration for business operations</p>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-accent hover:bg-panel hover:text-accent"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-7">{children}</main>
    </div>
  );
}
