# Zucco CRM — Frontend (`crm-zucco-frontend`)

Zucco o'quv markazlari uchun zamonaviy, tezkor va ko'p tilli boshqaruv tizimi (CRM & ERP).

---

## 🚀 Texnologik Stek

* **Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS + Zucco Green Design Tokens (`#146B52`)
* **State Management:** TanStack React Query (server kesh) + Zustand (mijoz holati)
* **Form & Validation:** React Hook Form + Zod
* **HTTP Client:** Axios (JWT Refresh Queue, Idempotency `X-Operation-Id`, Tenant header)
* **Ko'p tillilik (i18n):** 4 ta til (O'zbek Kirill, O'zbek Lotin, Rus, Ingliz)
* **Icons:** Lucide React
* **Notifications:** Sonner Toast

---

## 📂 Loyiha Strukturasi (Feature-Driven)

```
crm-zucco-frontend/
├── assets/          # Brending, logotiplar, SVG va dizayn aktivlari
├── prototype/       # Interaktiv HTML/JS dizayn prototipi va barcha 38 ta ekran
├── public/          # Statik fayllar va SVG ikonlar
├── src/
│   ├── api/             # Axios instance, token interceptor, apiRoutes.ts
│   ├── components/      # UI komponentlar (Button, Input, Badge, Modal, Shell)
│   ├── constants/       # Permissions (Backend bilan 100% bir xil), QueryKeys
│   ├── features/        # Feature modullar:
│   │   ├── auth/        # Kirish sahifasi va rollar
│   │   ├── overview/    # Bosh sahifa va asosiy KPI metrikalar
│   │   ├── leads/       # Lidlar voronkasi (Kanban), konversiya va yo'qotish modallari
│   │   ├── students/    # Talabalar ro'yxati, profili, muzlatish, ko'p guruhga yozilish
│   │   ├── groups/      # O'quv guruhlari va sig'im
│   │   ├── courses/     # Kurslar katalogi
│   │   ├── schedule/    # Haftalik dars jadvali
│   │   ├── attendance/  # Davomat jurnali, tangalar va baholash
│   │   ├── finance/     # Kassa, to'lov qabul qilish draweri, xarajatlar, oyliklar (payroll)
│   │   ├── staff/       # Xodimlar va o'qituvchilar
│   │   ├── market/      # Rag'batlantirish marketi va tangalar tarixi
│   │   ├── notifications/# SMS markazi
│   │   └── settings/    # Filiallar, sozlamalar va rollar (RBAC)
│   ├── i18n/            # Ko'p tillilik lug'atlari (uz-Cyrl, uz, ru, en)
│   ├── routes/          # Marshrutlar (paths.ts va AppRoutes)
│   ├── stores/          # Zustand do'konlari (authStore, appStore, languageStore)
│   └── utils/           # Formatters (valyuta, sana, telefon) va cn yordamchisi
├── RULES.md         # Loyihaning qat'iy arxitektura va kodlash qoidalari
└── README.md
```

---

## 🛠 O'rnatish va Ishga Tushirish

```bash
# Bog'liqliklarni o'rnatish
pnpm install

# Dasturchi serverini ishga tushirish (Local dev)
pnpm dev
```

Brauzerda: `http://localhost:5173`

### Production Build:
```bash
pnpm build
```

### Vercel: xavfsizlik header'lari va kesh
`vercel.json` barcha sahifalarga CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`,
`Permissions-Policy` va HSTS qo'yadi; `/assets/*` (hash'li fayllar) bir yil `immutable` keshlanadi, `index.html` esa keshlanmaydi.
CSP `connect-src` da API manzillari qo'lda yozilgan (`https://api.zucco.uz`, `https://api-test.zucco.uz`) — statik `vercel.json`
`VITE_API_URL` ni o'qiy olmaydi. API manzili o'zgarsa, `vercel.json` dagi `connect-src` ni ham yangilang.

---

## 📄 Qoidalar va Standartlar
Loyihaning qat'iy arxitektura va kodlash qoidalari: `RULES.md`
