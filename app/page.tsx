import { CreateForm } from "@/components/CreateForm";
import { Logo } from "@/components/Logo";
import { WindowCard } from "@/components/WindowCard";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md">
        <header className="mb-6 flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-gray-500">Anonim link ve not paylaşımı. Hesap yok, isteğe bağlı kısa isim.</p>
        </header>
        <WindowCard title="~/golink/new">
          <CreateForm />
        </WindowCard>
        <footer className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-400">
          <p>Spam koruması için IP başına dakikada 5, günde 50 link.</p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>./system.conf</span>
            <span className="text-gray-300">·</span>
            <a
              href="https://github.com/system-conf/golink"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-gray-600 hover:underline transition-colors"
            >
              github
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
