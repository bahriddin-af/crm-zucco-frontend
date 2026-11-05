import type { SupportedLanguage } from '../types'

const uzCyrl = {
  title: 'Zucco CRM тизимига кириш',
  subtitle: 'Ўқув маркази бошқаруви ва молиявий ҳисоб тизими',
  phone: 'Телефон рақами',
  phonePlaceholder: '+998901234567',
  password: 'Пароль',
  passwordPlaceholder: '••••••••',
  tenantId: 'Марказ идентификатори (Tenant ID)',
  tenantIdPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tenantIdHint: 'Идентификаторни марказ администраторидан олинг.',
  tenantIdInvalid: 'Идентификатор формати нотўғри',
  loginButton: 'Тизимга кириш',
  successMessage: 'Тизимга муваффақиятли кирдингиз!',
}

export type AuthMessages = typeof uzCyrl

export const authMessages: Record<SupportedLanguage, AuthMessages> = {
  'uz-Cyrl': uzCyrl,
  uz: {
    title: 'Zucco CRM tizimiga kirish',
    subtitle: "O'quv markazi boshqaruvi va moliyaviy hisob tizimi",
    phone: 'Telefon raqami',
    phonePlaceholder: '+998901234567',
    password: 'Parol',
    passwordPlaceholder: '••••••••',
    tenantId: 'Markaz identifikatori (Tenant ID)',
    tenantIdPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    tenantIdHint: 'Identifikatorni markaz administratoridan oling.',
    tenantIdInvalid: "Identifikator formati noto'g'ri",
    loginButton: 'Tizimga kirish',
    successMessage: 'Tizimga muvaffaqiyatli kirdingiz!',
  },
  ru: {
    title: 'Вход в систему Zucco CRM',
    subtitle: 'Управление учебным центром и финансовый учет',
    phone: 'Номер телефона',
    phonePlaceholder: '+998901234567',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    tenantId: 'Идентификатор центра (Tenant ID)',
    tenantIdPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    tenantIdHint: 'Получите идентификатор у администратора центра.',
    tenantIdInvalid: 'Неверный формат идентификатора',
    loginButton: 'Войти в систему',
    successMessage: 'Вы успешно вошли в систему!',
  },
  en: {
    title: 'Sign In to Zucco CRM',
    subtitle: 'Academy operations and financial management system',
    phone: 'Phone Number',
    phonePlaceholder: '+998901234567',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    tenantId: 'Center identifier (Tenant ID)',
    tenantIdPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    tenantIdHint: 'Ask your center administrator for the identifier.',
    tenantIdInvalid: 'Invalid identifier format',
    loginButton: 'Sign In',
    successMessage: 'Successfully signed in!',
  },
}
