// src/shared/lib/api.ts
import axios from "axios";

/**
 * 공통: 항상 같은-오리진의 "/api"로만 호출
 * - dev: Vite proxy가 /api → http://localhost:8080 으로 포워딩
 * - prod: Vercel rewrites가 /api → http://13.211.211.70:8080 으로 프록시
 */
const BASE = "";

// 공개용(쿠키 불필요)
export const api = axios.create({
    baseURL: BASE,
    withCredentials: false,
    headers: { Accept: "application/json" },
});

// 인증용(쿠키/세션 필요할 때만 이 인스턴스 사용)
export const authApi = axios.create({
    baseURL: BASE,
    withCredentials: true,
    headers: { Accept: "application/json" },
});

// 공통 응답 인터셉터(필요 시 확장)
const onRejected = (err: any) => {
    if (err?.response?.status === 401) {
        console.warn("[API] 401 unauthorized");
    }
    return Promise.reject(err);
};

api.interceptors.response.use((r) => r, onRejected);
authApi.interceptors.response.use((r) => r, onRejected);
