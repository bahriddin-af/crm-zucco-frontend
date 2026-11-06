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
VITE_API_URL=https://api.zucco.uz pnpm build
```

### API manzili (`VITE_API_URL`)

Ilova backend manzilini faqat `VITE_API_URL` dan oladi; hostname bo'yicha taxmin qilinmaydi.

* **Build'da majburiy.** O'rnatilmasa yoki URL noto'g'ri bo'lsa, `pnpm build` aniq xato bilan to'xtaydi.
* **Vercel:** Project → Settings → Environment Variables bo'limida `VITE_API_URL` ni **Production** (prod API) va **Preview** (test API) muhitlari uchun alohida o'rnating. Aks holda preview deploy build bosqichida yiqiladi.
* **Lokal dev:** bo'sh qoldiring — so'rovlar `vite.config.ts` dagi `/api` proxy orqali ketadi (`pnpm dev` → lokal backend, `pnpm dev:test` → test server).
* Namuna: `.env.example`. `.env*` fayllar commit qilinmaydi.

---

## 📄 Qoidalar va Standartlar
Loyihaning qat'iy arxitektura va kodlash qoidalari: `RULES.md`
