// Multilingual SEO locale routing
export const LOCALES = [
  "es", "de", "fr", "it", "pt", "nl", "pl", "ru", "sv", "da", "no", "fi", "cs", "ro", "el", "hu", "tr", "uk", "ar", "ja", "ko", "zh", "hi"
] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español", de: "Deutsch", fr: "Français", it: "Italiano", pt: "Português", nl: "Nederlands",
  pl: "Polski", ru: "Русский", sv: "Svenska", da: "Dansk", no: "Norsk", fi: "Suomi", cs: "Čeština",
  ro: "Română", el: "Ελληνικά", hu: "Magyar", tr: "Türkçe", uk: "Українська", ar: "العربية", ja: "日本語",
  ko: "한국어", zh: "中文", hi: "हिन्दी",
};

export const LOCALE_LABELS: Record<Locale, { home: string; tools: string; maps: string; guides: string; about: string; search: string; switchTo: string }> = {
  es: { home:"Inicio", tools:"Herramientas", maps:"Mapas", guides:"Guías", about:"Acerca de", search:"Buscar", switchTo:"Cambiar idioma" },
  de: { home:"Startseite", tools:"Werkzeuge", maps:"Karten", guides:"Ratgeber", about:"Über uns", search:"Suchen", switchTo:"Sprache ändern" },
  fr: { home:"Accueil", tools:"Outils", maps:"Cartes", guides:"Guides", about:"À propos", search:"Rechercher", switchTo:"Changer de langue" },
  it: { home:"Home", tools:"Strumenti", maps:"Mappe", guides:"Guide", about:"Chi siamo", search:"Cerca", switchTo:"Cambia lingua" },
  pt: { home:"Início", tools:"Ferramentas", maps:"Mapas", guides:"Guias", about:"Sobre", search:"Pesquisar", switchTo:"Mudar idioma" },
  nl: { home:"Home", tools:"Tools", maps:"Kaarten", guides:"Gidsen", about:"Over ons", search:"Zoeken", switchTo:"Taal wijzigen" },
  pl: { home:"Strona główna", tools:"Narzędzia", maps:"Mapy", guides:"Poradniki", about:"O nas", search:"Szukaj", switchTo:"Zmień język" },
  ru: { home:"Главная", tools:"Инструменты", maps:"Карты", guides:"Руководства", about:"О нас", search:"Поиск", switchTo:"Сменить язык" },
  sv: { home:"Hem", tools:"Verktyg", maps:"Kartor", guides:"Guider", about:"Om oss", search:"Sök", switchTo:"Byt språk" },
  da: { home:"Forside", tools:"Værktøjer", maps:"Kort", guides:"Guides", about:"Om os", search:"Søg", switchTo:"Skift sprog" },
  no: { home:"Hjem", tools:"Verktøy", maps:"Kart", guides:"Guider", about:"Om oss", search:"Søk", switchTo:"Bytt språk" },
  fi: { home:"Etusivu", tools:"Työkalut", maps:"Kartat", guides:"Oppaat", about:"Tietoa", search:"Hae", switchTo:"Vaihda kieltä" },
  cs: { home:"Domů", tools:"Nástroje", maps:"Mapy", guides:"Průvodci", about:"O nás", search:"Hledat", switchTo:"Změnit jazyk" },
  ro: { home:"Acasă", tools:"Instrumente", maps:"Hărți", guides:"Ghiduri", about:"Despre", search:"Caută", switchTo:"Schimbă limba" },
  el: { home:"Αρχική", tools:"Εργαλεία", maps:"Χάρτες", guides:"Οδηγοί", about:"Σχετικά", search:"Αναζήτηση", switchTo:"Αλλαγή γλώσσας" },
  hu: { home:"Kezdőlap", tools:"Eszközök", maps:"Térképek", guides:"Útmutatók", about:"Rólunk", search:"Keresés", switchTo:"Nyelv váltása" },
  tr: { home:"Ana sayfa", tools:"Araçlar", maps:"Haritalar", guides:"Rehberler", about:"Hakkımızda", search:"Ara", switchTo:"Dili değiştir" },
  uk: { home:"Головна", tools:"Інструменти", maps:"Карти", guides:"Посібники", about:"Про нас", search:"Пошук", switchTo:"Змінити мову" },
  ar: { home:"الرئيسية", tools:"الأدوات", maps:"الخرائط", guides:"الأدلة", about:"من نحن", search:"بحث", switchTo:"تغيير اللغة" },
  ja: { home:"ホーム", tools:"ツール", maps:"地図", guides:"ガイド", about:"概要", search:"検索", switchTo:"言語を変更" },
  ko: { home:"홈", tools:"도구", maps:"지도", guides:"가이드", about:"소개", search:"검색", switchTo:"언어 변경" },
  zh: { home:"首页", tools:"工具", maps:"地图", guides:"指南", about:"关于", search:"搜索", switchTo:"切换语言" },
  hi: { home:"होम", tools:"टूल्स", maps:"मैप्स", guides:"गाइड", about:"हमारे बारे में", search:"खोजें", switchTo:"भाषा बदलें" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localizedPath(locale: Locale, pathname: string) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function localeFromPath(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : null;
}
