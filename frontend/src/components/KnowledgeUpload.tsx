"use client";

import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getApiErrorMessage, uploadDocument } from "@/lib/api";

export function KnowledgeUpload() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleUpload(formData: FormData) {
    const file = formData.get("file");
    if (!(file instanceof File) || !file.name) {
      setStatus("Choose a text policy file before uploading.");
      return;
    }

    setBusy(true);
    setStatus("");
    try {
      const result = await uploadDocument(file);
      setStatus(`${result.filename} indexed into the knowledge base.`);
      router.refresh();
    } catch (caughtError) {
      setStatus(getApiErrorMessage(caughtError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={handleUpload} className="surface rounded-md p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Add company context</h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload a small FAQ, SOP, or policy text file for the retrieval layer to use in the next query.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            name="file"
            type="file"
            accept=".txt,.md,.csv"
            className="focus-ring max-w-72 rounded-md border border-line bg-panel px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
          />
          <button
            type="submit"
            disabled={busy}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            {busy ? "Indexing" : "Upload"}
          </button>
        </div>
      </div>
      {status ? <p className="mt-3 text-sm text-gray-600">{status}</p> : null}
    </form>
  );
}
