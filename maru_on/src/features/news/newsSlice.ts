// src/features/news/newsSlice.ts
import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ===================== 타입 ===================== */
// 요약(리스트)
export type NewsSummaryItem = {
    id: number;
    thumbnailUrl: string | null;
    title: string;
    date: string;
    link: string;
};
export type NewsSummary = NewsSummaryItem[];

// 상세(백엔드 DTO와 맞춤)
export type NewsDetail = {
    id: number;       // Long → number로 수신
    number: number;
    title: string;
    content: string;  // HTML 또는 일반 텍스트
    date: string;
    imgUrl: string[]; // 이미지 URL 배열
};

type SummaryState = {
    loading: boolean;
    data: NewsSummary | null;
    error: string | null;
    lastFetchedAt: number | null;
};

export type DetailEntry = {
    loading: boolean;
    data: NewsDetail | null;
    error: string | null;
    lastFetchedAt: number | null;
};

type DetailsState = {
    byId: Record<number, DetailEntry>;
};

export type NewsState = {
    summary: SummaryState;
    details: DetailsState;
};

/* ===================== 초기값 ===================== */
const initialState: NewsState = {
    summary: { loading: false, data: null, error: null, lastFetchedAt: null },
    details: { byId: {} },
};

/* ===================== Slice ===================== */
const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        /* ---- 요약 ---- */
        newsSummaryRequest(state) {
            state.summary.loading = true;
            state.summary.error = null;
        },
        newsSummarySuccess(state, action: PayloadAction<NewsSummary>) {
            state.summary.loading = false;
            state.summary.data = action.payload;
            state.summary.lastFetchedAt = Date.now();
        },
        newsSummaryFailure(state, action: PayloadAction<string>) {
            state.summary.loading = false;
            state.summary.error = action.payload;
        },

        /* ---- 상세(id별) ---- */
        newsDetailRequest(state, action: PayloadAction<number>) {
            const id = action.payload;
            const curr =
                state.details.byId[id] ??
                ({
                    loading: false,
                    data: null,
                    error: null,
                    lastFetchedAt: null,
                } as DetailEntry);
            state.details.byId[id] = { ...curr, loading: true, error: null };
        },
        newsDetailSuccess(
            state,
            action: PayloadAction<{ id: number; data: NewsDetail }>
        ) {
            const { id, data } = action.payload;
            state.details.byId[id] = {
                loading: false,
                data,
                error: null,
                lastFetchedAt: Date.now(),
            };
        },
        newsDetailFailure(
            state,
            action: PayloadAction<{ id: number; error: string }>
        ) {
            const { id, error } = action.payload;
            const curr =
                state.details.byId[id] ??
                ({
                    loading: false,
                    data: null,
                    error: null,
                    lastFetchedAt: null,
                } as DetailEntry);
            state.details.byId[id] = { ...curr, loading: false, error };
        },

        clearNews(state) {
            state.summary = { ...initialState.summary };
            state.details = { ...initialState.details };
        },
    },
});

export const {
    newsSummaryRequest,
    newsSummarySuccess,
    newsSummaryFailure,
    newsDetailRequest,
    newsDetailSuccess,
    newsDetailFailure,
    clearNews,
} = newsSlice.actions;

export default newsSlice.reducer;

/* ===================== Selectors ===================== */

// 루트 스토어 타입이 { news: NewsState } 라고 가정
export const selectNews = (s: { news: NewsState }) => s.news.summary;

// 빈 엔트리(참조 재사용)
const EMPTY_DETAIL: DetailEntry = {
    loading: false,
    data: null,
    error: null,
    lastFetchedAt: null,
};

// id별 메모이즈 셀렉터 팩토리 + 캐시
const detailSelectorFactoryCache = new Map<
    number,
    (s: { news: NewsState }) => DetailEntry
>();

export const makeSelectNewsDetailById = (id: number) => {
    if (detailSelectorFactoryCache.has(id)) {
        return detailSelectorFactoryCache.get(id)!;
    }
    const selector = createSelector(
        [(s: { news: NewsState }) => s.news.details.byId[id]],
        (entry): DetailEntry => entry ?? EMPTY_DETAIL
    );
    detailSelectorFactoryCache.set(id, selector);
    return selector;
};
