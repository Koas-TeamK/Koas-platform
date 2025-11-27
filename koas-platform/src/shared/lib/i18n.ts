// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "ko",
        supportedLngs: ["ko", "en", "zh"],
        ns: ["common"],
        defaultNS: "common",
        load: "languageOnly",
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "htmlTag", "navigator"],
            caches: ["localStorage"],
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },
        react: { useSuspense: false }
    });

export default i18n;
