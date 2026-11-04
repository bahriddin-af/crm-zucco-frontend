# Zucco Brand & Logo Guidelines

Ushbu qo'llanma **Zucco** (o'quv markazlari va akademiyalar uchun CRM/ERP platformasi) brend elementlari, logotiplar va ulardan foydalanish qoidalarini jamlagan.

---

## 🎨 1. Ranglar Palitrasi (Brand Palette)

| Rang Nomi | HEX Kodi | Tavsif / Qo'llanishi |
| :--- | :--- | :--- |
| **Primary Emerald** | `#146B52` | Asosiy brend rangi, tugmalar, asosiy urg'ular |
| **Primary Hover** | `#0F5943` | Tugma va interaktiv elementlar bosilgandagi holat |
| **Mint Accent** | `#10B981` | Ikkinchi darajali yorqin lenta va grafik belgi urg'usi |
| **Primary Soft** | `#E8F3ED` | Yengil fonlar, teglashlar, faol menyu elementi |
| **Dark Slate (Heading)** | `#1E2B24` | Matnlar, logotip so'zi (wordmark), sarlavhalar |
| **Caption Slate** | `#65776C` | Qo'shimcha matnlar, subtitrlar |
| **Canvas Background** | `#F6F8F7` | Tizimning umumiy foni |
| **Surface White** | `#FFFFFF` | Kartochkalar, modallar va toza fon |

---

## 📁 2. Fayllar Strukturasi (`assets/branding/`)

- [`zucco-logo-primary.svg`](file:///assets/branding/zucco-logo-primary.svg) — Asosiy gorizontal vektor logotip (yorug' fonlar uchun).
- [`zucco-logo-white.svg`](file:///assets/branding/zucco-logo-white.svg) — To'q / qorong'i fonlar (Dark Mode) uchun oq logotip.
- [`zucco-symbol.svg`](file:///assets/branding/zucco-symbol.svg) — Faqat 'Z' geometrik belgisi (monogramma).
- [`zucco-app-icon.svg`](file:///assets/branding/zucco-app-icon.svg) — Mobil ilova (iOS/Android) va PWA uchun yumaloq kvadratli (squircle) belgi.
- [`favicon.svg`](file:///assets/branding/favicon.svg) — Brauzer yorlig'i ikonkasi (32x32 / 64x64).
- [`zucco-logo-v3.png`](file:///assets/branding/zucco-logo-v3.png) — Tavsiya etilgan Master SaaS konsepti (PNG formatda).
- [`zucco-logo-v4-growth.png`](file:///assets/branding/zucco-logo-v4-growth.png) — Dinamik o'sish (Growth) konsepti.
- [`ZuccoLogo.tsx`](file:///assets/branding/ZuccoLogo.tsx) — React / Next.js uchun tayyor SVG komponent.
- [`preview.html`](file:///assets/branding/preview.html) — Barcha variantlarni interaktiv ko'rish va yuklab olish uchun vitrina.

---

## 💻 3. Frontendda Foydalanish (React / Tailwind)

Komponentni import qilib to'g'ridan-to'g'ri ishlatishingiz mumkin:

```tsx
import { ZuccoLogo } from '@/assets/branding/ZuccoLogo';

// Navbar uchun standart gorizontal logotip:
<ZuccoLogo variant="primary" size={38} />

// Dark mode yoki to'q yashil sidebar uchun:
<ZuccoLogo variant="white" size={38} />

// Kichraytirilgan (collapsed) sidebar yoki avatar uchun:
<ZuccoLogo variant="symbol" size={32} />
```

---

## 📐 4. Ishlatish Qoidalari (Clear Space & Rules)

1. **Clear Space (Xavfsiz masofa)**:
   Logotip atrofida ramz balandligining kamida 50% miqdorida bo'sh masofa saqlanishi kerak.
2. **Nisbatlar (Aspect Ratio)**:
   Logotipni eniga yoki bo'yiga cho'zish (stretch qilish) qat'iyan man etiladi.
3. **So'z yozilishi**:
   Brend nomi har doim kichik harflarda **`zucco`** shaklida yoziladi.
