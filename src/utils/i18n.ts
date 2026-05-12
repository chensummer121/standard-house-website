import i18nData from '../data/i18n.json';

export type Lang = 'zh' | 'en';

export interface I18nData {
  [key: string]: string | I18nData;
}

/**
 * Get the current language from URL path
 * URL路径格式: /invest/en/ethiopia -> en
 * URL路径格式: /invest/ethiopia -> zh (default)
 */
export function getLangFromPath(path: string): Lang {
  // Check if path contains /en/ segment
  const enMatch = path.match(/\/invest\/en\//);
  return enMatch ? 'en' : 'zh';
}

/**
 * Get the localized path for a given path and target language
 */
export function getLocalizedPath(path: string, targetLang: Lang): string {
  if (targetLang === 'en') {
    // Add /en/ to path if not present
    if (!path.includes('/invest/en/')) {
      return path.replace('/invest/', '/invest/en/');
    }
    return path;
  } else {
    // Remove /en/ from path
    return path.replace('/invest/en/', '/invest/');
  }
}

/**
 * Get translation text by key path (e.g., 'nav.decision')
 */
export function t(keyPath: string, lang: Lang): string {
  const keys = keyPath.split('.');
  let current: string | I18nData = i18nData;
  
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key] as string | I18nData;
    } else {
      return keyPath; // Return key if not found
    }
  }
  
  if (typeof current === 'string') {
    // Check if this is an English key (ends with 'En')
    if (lang === 'en' && current.endsWith('En')) {
      return current;
    }
    // If we're in English mode and there's an En variant, return it
    if (lang === 'en') {
      const enKey = keyPath + 'En';
      const enResult = t(enKey, lang);
      if (enResult !== enKey) {
        return enResult;
      }
    }
    return current;
  }
  
  return keyPath;
}

/**
 * Get both Chinese and English versions of a key
 */
export function tBoth(keyPath: string): { zh: string; en: string } {
  return {
    zh: t(keyPath, 'zh'),
    en: t(keyPath, 'en')
  };
}

/**
 * Helper to check if current path is English version
 */
export function isEnglishPath(path: string): boolean {
  return path.includes('/invest/en/');
}

/**
 * Get language preference from localStorage (client-side only)
 */
export function getStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('site-lang');
  if (stored === 'en' || stored === 'zh') {
    return stored;
  }
  return null;
}

/**
 * Store language preference (client-side only)
 */
export function setStoredLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('site-lang', lang);
}

// Country names in both languages
export const countryNames = {
  ethiopia: { zh: '埃塞俄比亚', en: 'Ethiopia' },
  uganda: { zh: '乌干达', en: 'Uganda' },
  kenya: { zh: '肯尼亚', en: 'Kenya' }
};

export function getCountryName(country: string, lang: Lang): string {
  const names = countryNames[country as keyof typeof countryNames];
  if (names) {
    return lang === 'en' ? names.en : names.zh;
  }
  return country;
}
