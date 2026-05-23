import { CreateForm } from "@/components/CreateForm";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">go</h1>
          <p className="text-sm text-gray-500 mt-1">Anonim link ve not paylaşımı. Hesap yok, isteğe bağlı kısa isim.</p>
        </header>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <CreateForm />
        </div>
        <footer className="mt-6 text-center text-xs text-gray-400">
          Spam koruması için IP başına dakikada 5, günde 50 link.
        </footer>
      </div>
    </main>
  );
}
