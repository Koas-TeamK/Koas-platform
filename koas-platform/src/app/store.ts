// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";

import uiReducer from "@/features/ui/uiSlice";
import newsReducer from "@/features/news/newsSlice";
import { newsSaga } from "@/features/news/newsSaga";
import serialReducer from "@/features/serial/serialSlice";
import { serialSaga } from "@/features/serial/serialSaga";

// 1) 루트 사가를 이 파일 안에 선언
function* rootSaga() {
    yield all([
        fork(newsSaga),
        fork(serialSaga)
    ]);
}

// 2) 사가 미들웨어 생성
const sagaMiddleware = createSagaMiddleware();

// 3) 스토어 생성
export const store = configureStore({
    reducer: {
        ui: uiReducer,
        news: newsReducer,
        serial: serialReducer,
    },
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
    devTools: import.meta.env.DEV,
});

// 4) 루트 사가 실행
sagaMiddleware.run(rootSaga);

// 5) 타입
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
