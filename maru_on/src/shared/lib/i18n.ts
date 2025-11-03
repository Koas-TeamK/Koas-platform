// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend)          // /public/locales에서 json 로드
    .use(LanguageDetector)     // localStorage/html lang/navigator 순으로 감지
    .use(initReactI18next)     // react-i18next 연결
    .init({
        fallbackLng: "ko",
        supportedLngs: ["ko", "en", "zh"],
        ns: ["common"],
        defaultNS: "common",
        load: "languageOnly",
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "htmlTag", "navigator"],
            caches: ["localStorage"], // 선택 저장소
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        },
        // 개발 중 깜빡임 방지: Suspense를 안 쓰려면 아래 옵션을 켜도 됨
        react: { useSuspense: false }
    });

export default i18n;
