# go — anonim link & not paylaşımı

`go.systemconf.online` altında çalışacak küçük bir kısaltma / pastebin servisi.

- Link kısalt veya kısa not paylaş
- Custom slug ver (boş bırakırsan otomatik 6 karakter)
- Geçerlilik süresi (1 saat / 1 gün / 7 gün / 30 gün / hiç)
- Anonim — hesap yok
- IP başına rate limit (dakikada 5, günde 50)

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Turso (libSQL) + Drizzle ORM
- Upstash Redis + @upstash/ratelimit
- Vercel (hosting + Cron)

## Local development

1. `cp .env.example .env.local` ve değerleri doldur
   - Turso: `turso db create systemconf-go` → token al
   - Upstash: Vercel Marketplace veya upstash.com'dan Redis instance oluştur
   - `IP_HASH_SALT`: `openssl rand -hex 32`
2. `npm install`
3. `npm run db:push` — schema'yı Turso'ya gönder
4. `npm run dev` → http://localhost:3000

## Deploy

1. Bu klasörü bir GitHub repo'suna push et
2. Vercel'de import et, env değişkenlerini ekle
3. Vercel Settings → Domains → `go.systemconf.online` ekle
4. systemconf.online DNS panelinde `go` için CNAME → `cname.vercel-dns.com`
5. Vercel Cron `vercel.json` üzerinden otomatik aktifleşir

## Yapı

```
app/
  page.tsx              # ana form
  [slug]/page.tsx       # redirect veya not görünümü
  not-found.tsx
  api/
    create/route.ts     # POST yeni entry
    cleanup/route.ts    # Vercel Cron, expired entry'leri siler
components/
  CreateForm.tsx
  ResultCard.tsx
  NoteView.tsx
  CopyButton.tsx
lib/
  db.ts                 # Turso/Drizzle client
  schema.ts             # entries tablosu
  slug.ts               # validate + nanoid
  hash.ts               # IP hash
  expiration.ts         # "7d" → ms
  ratelimit.ts          # Upstash sliding window
```

## License

MIT — bkz. [LICENSE](./LICENSE).
