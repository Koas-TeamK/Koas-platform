/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Noto Sans KR', 'system-ui', 'sans-serif'],
                goun: ["GowunDodum", "Noto Sans KR", "sans-serif"]
            },
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
};