/** @type {import('tailwindcss').Config} */
export default {
    important: true,
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Noto Sans KR', 'system-ui', 'sans-serif'],
                goun: ["GowunDodum", "Noto Sans KR", "sans-serif"],
                pretendard: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
};