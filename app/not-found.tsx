import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900">404</h1>
        <p className="mt-2 text-sm text-gray-500">
          Aradığın link bulunamadı ya da süresi dolmuş.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Yeni link oluştur
        </Link>
      </div>
    </main>
  );
}
