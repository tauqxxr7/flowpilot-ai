import { Database } from "lucide-react";
import { getDocuments } from "@/lib/api";
import { KnowledgeUpload } from "@/components/KnowledgeUpload";

export default async function KnowledgeBasePage() {
  const documents = await getDocuments().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-md border border-line bg-white p-2">
          <Database className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div>
          <p className="page-kicker">Business context</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Policies used for retrieval and citations</h1>
          <p className="mt-1 text-sm text-gray-600">Seeded support rules and uploaded notes used to ground workflow decisions.</p>
        </div>
      </div>
      <KnowledgeUpload />
      <section className="surface rounded-md p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((doc) => (
            <article key={doc.id} className="rounded-md border border-line bg-panel p-4 transition hover:border-gray-300 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{doc.title}</h2>
                  <p className="mt-1 text-xs text-gray-500">{doc.source}</p>
                </div>
                <span className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold capitalize text-gray-700">
                  {doc.category}
                </span>
              </div>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-700">{doc.content}</p>
            </article>
          ))}
        </div>
        {!documents.length ? <p className="text-sm text-gray-600">Backend is waking up or no documents are indexed yet. Please wait 30-60 seconds and try again.</p> : null}
      </section>
    </div>
  );
}
