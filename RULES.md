# Zucco — Frontend Loyihasi uchun Yagona Qoidalar To'plami (FRONTEND_RULES.md)

Ushbu hujjat **Zucco CRM** frontend ilovasi (`apps/crm-web`) ustida ishlovchi barcha muhandislar, sun'iy intellekt agentlari va dasturchilar uchun **yagona haqiqat manbai (Single Source of Truth)** hisoblanadi.

Backenddagi kabi, ushbu qoidalarga qat'iy rioya qilish majburiydir.

---

## ⚡ 0. ENG USTUVOR QOIDA: DRY VA ZERO MAGIC VALUES TAMOYILLARI

1. **DRY (Don't Repeat Yourself) — Murosasiz Kod Qayta Foydalanishi**:
   - Bir xil komponentlar, modal oynalar, form elementlari, qidiruv/filtr mantiqlari va formatlash funksiyalari qayta-qayta yozilmaydi. Umumiy qismga (`components/ui`, `components/forms`, `utils/`) chiqariladi.

2. **Zero Magic Values — Magic String, URL va Numberlardan Butkul Qochish**:
   - **API Endpointlar**: Hech qachon URL satr (`/api/students/...`) komponent ichida yozilmaydi. Faqat `api/apiRoutes.ts` orqali.
   - **Frontend Sahifa Yo'llari (Routes)**: `routes/paths.ts` dagi konstantalar orqali (`ROUTES.STUDENTS.LIST`, `ROUTES.FINANCE.CASHBOX`).
   - **Ruxsatnomalar (Permissions)**: Faqat `constants/permissions.ts` (Backend `Permissions.cs` ga 100% muvofiq).
   - **React Query kesh kalitlari**: Faqat `constants/queryKeys.ts` factory funksiyalari orqali (`studentKeys.detail(id)`, `leadKeys.list(filters)`).
   - **Holatlar va Statuslar**: Faqat `enum` yoki `const assertion` (`as const`) orqali (`StudentStatus.Active`, `PaymentType.Cash`).

3. **Feature-Driven (Modulga Asoslangan) Folder Strukturasi**:
   - Har bir domen (modul) o'z papkasiga ega bo'ladi: `src/features/<module>/`.
   - Modul ichi faqat o'ziga tegishli qismlardan iborat:
     - `features/<module>/api/` — React Query hooklari va API chaqiruvlari.
     - `features/<module>/components/` — Modulga xos UI komponentlar.
     - `features/<module>/types/` — Modul DTO va interfeyslari.
     - `features/<module>/hooks/` — Modulga tegishli custom hooklar.

4. **Git va Branch Intizomi**:
   - Asosiy branchga to'g'ridan-to'g'ri commit qilinmaydi. Har bir vazifa `author/feature-name` shaklidagi branchda bajariladi.

5. **Backend Bilan Sinxronlik (Upsert & Idempotency)**:
   - Backendning `CreateOrUpdate` (Upsert) kontraktlariga qat'iy rioya qilinadi.
   - Har qanday moliyaviy yozish amali (to'lov, chiqim, oylik) yuborilishida **`X-Operation-Id` (UUID v4)** generatsiya qilinishi shart.

---

## 1. Qat'iy Taqiqlangan Arxitektura Anti-Patternlari

1. ❌ **`any` tipini ishlatish qat'iyan taqiqlangan**:
   - TypeScriptda `any` yozish jinoyat hisoblanadi. Agar tip oldindan noma'lum bo'lsa, `unknown` ishlatilib, Zod yoki type guard bilan toraytiriladi (narrowing).
2. ❌ **Komponent ichida to'g'ridan-to'g'ri `fetch` yoki `axios` chaqirish taqiqlangan**:
   - Komponent faqat UI va foydalanuvchi ta'sirini boshqaradi. Ma'lumot olish va yuborish faqat TanStack Query (`useQuery`, `useMutation`) hooklari orqali bo'lishi shart.
3. ❌ **Server holatini (Server State) global client storedagi (Zustand) saqlash taqiqlangan**:
   - Serverdan keladigan ma'lumotlar (talabalar ro'yxati, hisobotlar, lidlar) **TanStack Query** keshida turadi.
   - **Zustand** faqat sof mijoz holatlari (Auth sessiyasi, Tanlangan faol filial, Sidebar holati, Dark/Light tema) uchun ishlatiladi.
4. ❌ **"God Component" (150-200 qatordan oshib ketgan ulkan komponent) yaratish taqiqlangan**:
   - Agar sahifa yoki komponent kattalashib ketsa, u darhol subkomponentlarga bo'linadi (masalan, `StudentProfileHeader`, `StudentBalanceCard`, `StudentAttendanceTable`).
5. ❌ **Inline style (`style={{ ... }}`) ishlatish taqiqlangan**:
   - Faqat Tailwind CSS klasslari. Dinamik klasslar uchun `clsx` va `tailwind-merge` (`cn(...)` yordamchisi) ishlatiladi.
6. ❌ **Formlarda validatsiyasiz shunchaki `useState` tiqish taqiqlangan**:
   - Barcha formalar `React Hook Form + Zod` orqali quriladi. Zod sxemasi backend DTO validatsiyasi bilan 100% bir xil qoidalarga ega bo'lishi shart.
7. ❌ **Xatoliklarni yutib yuborish (Silent Failures) yoki konsolga tashlab qo'yish taqiqlangan**:
   - Foydalanuvchiga har qanday server yoki tarmoq xatoligi tushunarli `toast` yoki `Alert` shaklida ko'rsatilishi shart.
8. ❌ **Magic Number va Hardcoded valyutalar taqiqlangan**:
   - Narxlar, so'm formatlari va sanalar uchun markaziy yordamchi funksiyalar ishlatiladi (`formatCurrency(amount)`, `formatDate(date)`).

---

## 2. Axborot Oqimi va Qatlamlar Tartibi (Flow)

Ma'lumotlar oqimi bir tomonlama va qat'iy zanjir asosida ishlaydi:

```
[UI Komponent]
       │
       ▼
[React Hook Form + Zod] (Agar forma bo'lsa)
       │
       ▼
[Feature React Query Hook] (useStudentQuery / useCreatePaymentMutation)
       │
       ▼
[Feature API Service] (studentApi.createOrUpdate)
       │
       ▼
[Axios Client Instance] (Bearer Token, Tenant ID, X-Operation-Id, 401 Refresh Interceptor)
       │
       ▼
[Backend API] (.NET 9 Controller)
```

---

## 3. Komponentlar va UI Qoidalari

1. **Shadcn UI Baza Sifatida**:
   - Barcha asosiy tugmalar, dialoglar, kiritish maydonlari (input), dropdownlar `@/components/ui/` ichidagi Shadcn UI komponentlariga asoslanadi.
2. **Yuklanish va Bo'sh Holatlar (Loading & Empty States)**:
   - Har bir ma'lumot yuklanadigan ro'yxat uchun **Skeleton** (yoki Spinner) bo'lishi shart.
   - Ma'lumot yo'q bo'lgan holatda bo'sh ekran qolmasligi kerak; chiroyli `EmptyState` (rasm/ikonka, izoh va "Qo'shish" tugmasi) ko'rsatilishi shart.
3. **Optimistic Updates**:
   - Davomat belgilash, lidni keyingi bosqichga sudrab o'tkazish kabi tezkor amallarda foydalanuvchi server javobini kutib o'tirmasligi uchun TanStack Query optimistik yangilash imkoniyatidan foydalanishi kerak.
4. **Xatolik Izolyatsiyasi (Local Error Boundaries)**:
   - Biror komponentda (masalan, davomat jadvali) kutilmagan JS xatoligi yuz bersa, butun ilova oq ekran (White Screen of Death) bo'lib qolmasligi uchun har bir asosiy sahifa va vidjet alohida `ErrorBoundary` bilan o'ralishi shart.
5. **Katta Ma'lumotlar va Virtualizatsiya**:
   - Minglab satrli jadvallarda DOM og'irlashmasligi uchun qat'iy paginatsiya yoki zarur hollarda virtual scrolling (`@tanstack/react-virtual`) qo'llanilishi kerak.
6. **Tarmoq Holati (Offline/Online Awareness)**:
   - Internet uzilishi hollarida foydalanuvchini ogohlantiruvchi tarmoq holati indikatori (Offline banner) bo'lishi shart.

---

## 4. Xavfsizlik va Ruxsatnomalar (RBAC)

1. **Token Yangilanishi (JWT Token Rotation)**:
   - `401 Unauthorized` tushganda Axios interceptor so'rovlarni navbatga qo'yadi va orqa fonda `POST /api/auth/refresh` ni chaqiradi.
   - Foydalanuvchi ishini to'xtatmasdan token yangilanadi va to'xtatilgan so'rovlar avtomatik yuboriladi.
   - Agar sessiya muddati butunlay tugagan bo'lsa, xotira tozalanib `/auth/login` ga yo'naltiriladi.
2. **Permission Guard**:
   - Foydalanuvchi roli yoki ruxsati yetarli bo'lmagan tugma va sahifalar ko'rsatilmaydi:
     ```tsx
     <PermissionGuard permission={PERMISSIONS.PAYMENTS.CREATE}>
       <Button onClick={openPaymentModal}>To'lov Qabul Qilish</Button>
     </PermissionGuard>
     ```

---

## 5. Fayl Nomlash va Kod Konventsiyalari

| Element turi | Qoida | Misol |
| :--- | :--- | :--- |
| **React Komponentlar** | PascalCase | `StudentCard.tsx`, `LeadKanbanBoard.tsx` |
| **Custom Hooklar** | camelCase (`use` prefiksi) | `useStudentList.ts`, `useActiveBranch.ts` |
| **Yordamchi Funksiyalar** | camelCase | `formatCurrency.ts`, `dateUtils.ts` |
| **Konstantalar va Enimlar** | SCREAMING_SNAKE_CASE yoki PascalCase | `ROUTES`, `QUERY_KEYS`, `StudentStatus` |
| **TypeScript Interfeyslari** | PascalCase | `StudentDto`, `CreatePaymentRequest` |
| **Papka nomlari** | kebab-case yoki camelCase | `features/student-profile/`, `components/ui/` |

---

## 6. Zero Tolerance (Murosasizlik Deklaratsiyasi)

Quyidagi holatlar PR (Pull Request) tekshiruvidan **o'tkazilmaydi va bekor qilinadi**:
- `console.log` qoldirilgan kodlar.
- `// @ts-ignore` yoki `any` ishlatilgan joylar.
- URL yoki ruxsatnoma nomi qattiq kodlangan (hardcoded string) qismlar.
- Formada Zod sxemasisiz to'g'ridan-to'g'ri `onChange` da API ga so'rov yuborish.
- O'chirish va to'lov amallarida tasdiqlash modali (`ConfirmDialog`) bo'lmagan holatlar.
