export const BCP47_CATALOG = [
    // Español
    { tag: "es", label: "Español (genérico)" },
    { tag: "es-MX", label: "Español (México)" },
    { tag: "es-ES", label: "Español (España)" },
    { tag: "es-AR", label: "Español (Argentina)" },
    { tag: "es-CO", label: "Español (Colombia)" },
    { tag: "es-CL", label: "Español (Chile)" },
    { tag: "es-PE", label: "Español (Perú)" },
    { tag: "es-US", label: "Español (EE. UU.)" },

    // Inglés
    { tag: "en", label: "English (generic)" },
    { tag: "en-US", label: "English (United States)" },
    { tag: "en-GB", label: "English (United Kingdom)" },
    { tag: "en-CA", label: "English (Canada)" },
    { tag: "en-AU", label: "English (Australia)" },

    // Portugués
    { tag: "pt", label: "Português (genérico)" },
    { tag: "pt-BR", label: "Português (Brasil)" },
    { tag: "pt-PT", label: "Português (Portugal)" },

    // Francés
    { tag: "fr", label: "Français (générique)" },
    { tag: "fr-FR", label: "Français (France)" },
    { tag: "fr-CA", label: "Français (Canada)" },

    // Alemán e italiano
    { tag: "de", label: "Deutsch (allgemein)" },
    { tag: "de-DE", label: "Deutsch (Deutschland)" },
    { tag: "it", label: "Italiano (generico)" },
    { tag: "it-IT", label: "Italiano (Italia)" },

    // Chino / Japonés / Coreano
    { tag: "zh", label: "中文 (通用)" },
    { tag: "zh-Hans", label: "中文（简体）" },
    { tag: "zh-Hant", label: "中文（繁體）" },
    { tag: "zh-CN", label: "中文（中国大陆）" },
    { tag: "zh-TW", label: "中文（台灣）" },
    { tag: "ja", label: "日本語" },
    { tag: "ko", label: "한국어" },

    // Otros muy usados
    { tag: "ar", label: "العربية" },
    { tag: "ru", label: "Русский" },
    { tag: "nl", label: "Nederlands" },
    { tag: "pl", label: "Polski" },
    { tag: "tr", label: "Türkçe" },
    { tag: "he", label: "עברית" },
    { tag: "sv", label: "Svenska" },
    { tag: "no", label: "Norsk" },
    { tag: "fi", label: "Suomi" },
    { tag: "da", label: "Dansk" },
    { tag: "cs", label: "Čeština" },
    { tag: "el", label: "Ελληνικά" },
    { tag: "ro", label: "Română" },
    { tag: "hu", label: "Magyar" },
    { tag: "uk", label: "Українська" },
    { tag: "vi", label: "Tiếng Việt" },
    { tag: "th", label: "ไทย" },
    { tag: "hi", label: "हिन्दी" },
    { tag: "id", label: "Bahasa Indonesia" },
    { tag: "ms", label: "Bahasa Melayu" },
    { tag: "fa", label: "فارسی" },
    { tag: "ur", label: "اردو" },

    // Regiones europeas adicionales
    { tag: "bg", label: "Български" },
    { tag: "sr", label: "Српски" },
    { tag: "sk", label: "Slovenčina" },
    { tag: "sl", label: "Slovenščina" },
    { tag: "lt", label: "Lietuvių" },
    { tag: "lv", label: "Latviešu" },
    { tag: "et", label: "Eesti" },

    // España cooficiales (útiles en MX/España)
    { tag: "ca", label: "Català" },
    { tag: "eu", label: "Euskara" },
    { tag: "gl", label: "Galego" }
];

// Utilidad de validación simple
export function isValidBCP47(tag) {
    if (typeof tag !== "string") return false;
    const basic = /^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/; // validación suave
    return basic.test(tag);
}