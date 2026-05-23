"use client";

import { useState } from "react";
import { ResultCard } from "./ResultCard";

type Tab = "link" | "note";
type Expiration = "1h" | "1d" | "7d" | "30d" | "never";

const EXPIRATION_LABELS: Record<Expiration, string> = {
  "1h": "1 saat",
  "1d": "1 gün",
  "7d": "7 gün",
  "30d": "30 gün",
  never: "Hiç",
};

type Result = { url: string; expiresAt: number | null };

export function CreateForm() {
  const [tab, setTab] = useState<Tab>("link");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [expiresIn, setExpiresIn] = useState<Expiration>("7d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function reset() {
    setContent("");
    setSlug("");
    setExpiresIn("7d");
    setError(null);
    setResult(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tab, content: content.trim(), slug: slug.trim(), expiresIn }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bir hata oluştu.");
      } else {
        setResult({ url: data.url, expiresAt: data.expiresAt });
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return <ResultCard url={result.url} expiresAt={result.expiresAt} onReset={reset} />;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="inline-flex rounded-md border border-gray-200 bg-gray-100 p-1 self-start">
        <button
          type="button"
          onClick={() => setTab("link")}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === "link" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => setTab("note")}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
            tab === "note" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Not
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-gray-700">
          {tab === "link" ? "Uzun link" : "Notun"}
        </label>
        {tab === "link" ? (
          <input
            id="content"
            type="url"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://uzun-link..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900"
          />
        ) : (
          <textarea
            id="content"
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notunu buraya yaz..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 font-mono resize-none"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
          Kısa isim (opsiyonel)
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="boş bırakırsan otomatik"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="expires" className="text-sm font-medium text-gray-700">
          Geçerlilik
        </label>
        <select
          id="expires"
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value as Expiration)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-900"
        >
          {(Object.keys(EXPIRATION_LABELS) as Expiration[]).map((k) => (
            <option key={k} value={k}>
              {EXPIRATION_LABELS[k]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-gray-800 rounded-md border border-gray-300 bg-gray-100 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? "Oluşturuluyor..." : "Oluştur"}
      </button>
    </form>
  );
}
