import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-400">404</h1>
        <p className="mt-2 text-sm text-gray-500">
          Aradığın link bulunamadı ya da süresi dolmuş.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300"
        >
          Yeni link oluştur
        </Link>
      </div>
    </main>
  );
}
