import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'it', 'ms', 'pl', 'pt', 'se', 'tr', 'ru', 'ar']
export const DEFAULT_LOCALE = 'en'
export const LOCALE_NAMES: Record<string, string> = {
  'en': "English",
  'zh': "中文",
  'ja': "日本語",
  'ko': "한국어",
  'de': "Deutsch",
  'es': "Español",
  'fr': "Français",
  'it': "Italiano",
  'ms': "Bahasa Melayu",
  'pl': "Polski",
  'pt': "Português",
  'se': "Svenska",
  'tr': "Türkçe",
  'ru': "Русский",
  'ar': "العربية",
};

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // 完全禁用语言自动检测，防止 Google 爬虫被重定向
  localeDetection: false,
  // 保持 'as-needed'：默认语言(en)不需要前缀，其他语言需要
  localePrefix: 'as-needed',
});

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);


export type Locale = (typeof routing.locales)[number];
