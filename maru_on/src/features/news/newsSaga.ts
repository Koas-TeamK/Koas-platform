// src/features/news/newsSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "@/shared/lib/api";
import {
    newsSummaryRequest,
    newsSummarySuccess,
    newsSummaryFailure,
    newsDetailRequest,
    newsDetailSuccess,
    newsDetailFailure,
} from "./newsSlice";
import type { NewsSummary, NewsDetail } from "./newsSlice";

/* ===================== API ===================== */
function fetchNewsSummaryApi() {
    return api.get<NewsSummary>("/api/news/summary");
}

function fetchNewsDetailApi(id: number) {
    // 백엔드: ResponseEntity<News>
    return api.get<NewsDetail>(`/api/news/${id}`);
}

/* ===================== Workers ===================== */
function* handleNewsSummaryRequest() {
    try {
        const res: { data: any } = yield call(fetchNewsSummaryApi);

        // 1) 원본 응답 로그
        //console.log("[뉴스 요약 응답 원본]", res.data);

        // 2) 방어적 정규화(배열이 아닐 수도 있음)
        const raw = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.content)
                ? res.data.content
                : [];

        //console.log("[뉴스 요약 정규화 전 길이]", raw.length, raw);

        // 3) 프론트 타입(NewsSummaryItem)에 맞게 매핑
        const list: NewsSummary = raw.map((item: any) => ({
            id: Number(item.id ?? item.newsId ?? item.number ?? 0),
            title: String(item.title ?? ""),
            date: String(item.date ?? ""),
            link: String(item.link ?? ""),
            thumbnailUrl:
                item.thumbnailUrl ??
                (Array.isArray(item.imgUrl) && item.imgUrl.length > 0 ? item.imgUrl[0] : null),
        }));

        // 4) 최종 결과 로그
        //console.log("[뉴스 요약 최종 매핑]", list);

        yield put(newsSummarySuccess(list));
    } catch (err: any) {
        console.error("[뉴스 요약 오류]", err);
        const msg =
            err?.response?.data?.message ??
            err?.message ??
            "뉴스 요약 조회 중 오류가 발생했습니다.";
        yield put(newsSummaryFailure(msg));
    }
}


function* handleNewsDetailRequest(action: ReturnType<typeof newsDetailRequest>) {
    const id = action.payload;
    try {
        const res: { data: NewsDetail } = yield call(fetchNewsDetailApi, id);
        //console.log("[뉴스 상세 응답]", res.data);
        yield put(newsDetailSuccess({ id, data: res.data }));
    } catch (err: any) {
        //console.error("[뉴스 상세 오류]", err);
        yield put(newsDetailFailure({ id, error: err?.message || "오류" }));
    }
}


/* ===================== Watcher ===================== */
export function* newsSaga() {
    yield takeLatest(newsSummaryRequest.type, handleNewsSummaryRequest);
    yield takeLatest(newsDetailRequest.type, handleNewsDetailRequest);
}
