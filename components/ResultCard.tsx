"use client";

import { CopyButton } from "./CopyButton";

type Props = {
  url: string;
  expiresAt: number | null;
  onReset: () => void;
};

export function ResultCard({ url, expiresAt, onReset }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Linkin hazır</p>
        <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2.5">
          <span className="flex-1 truncate font-mono text-sm text-gray-900">{url}</span>
          <CopyButton value={url} />
        </div>
      </div>
      {expiresAt && (
        <p className="text-xs text-gray-500">
          Geçerlilik: {new Date(expiresAt).toLocaleString("tr-TR")}
        </p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="self-start text-sm font-medium text-gray-900 underline-offset-4 hover:underline"
      >
        Yeni oluştur
      </button>
    </div>
  );
}
