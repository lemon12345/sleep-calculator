import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`./messages/${locale}/common.json`)).default;

  return {
    locale,
    messages: {
      // Main pages
      Home: (await import(`./messages/${locale}/Home.json`)).default,
      
      // Sleep Calculator  
      SleepCalculator: (await import(`./messages/${locale}/SleepCalculator.json`)).default,
      
      // common
      ...common
    }
  };
});