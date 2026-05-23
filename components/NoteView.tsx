import { CopyButton } from "./CopyButton";

export function NoteView({ content, expiresAt }: { content: string; expiresAt: number | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-gray-500">Not</p>
        <CopyButton value={content} label="Notu kopyala" />
      </div>
      <pre className="whitespace-pre-wrap break-words rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900">
        {content}
      </pre>
      {expiresAt && (
        <p className="text-xs text-gray-500">
          Bu not {new Date(expiresAt).toLocaleString("tr-TR")} tarihine kadar erişilebilir.
        </p>
      )}
    </div>
  );
}
