//src/features/serialSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { api } from "@/shared/lib/api";
import {
    qrCheckRequest, qrCheckSuccess, qrCheckFailure
} from "./serialSlice"
import type { SerialData, QrParams } from "./serialSlice"


// ========== API ===============
export async function fetchQrCheckApi(params: QrParams) {
    // GET 쿼리: axios는 params 옵션으로 전달
    const { data } = await api.get<SerialData>("/api/qr/check", {
        params,                // { name, serial, token }
        withCredentials: true, // 필요 시 유지
        headers: { Accept: "application/json" },
    });
    return data; // SerialData
}

// =========== workers ==============
function* handleQrCheckRequest(action: ReturnType<typeof qrCheckRequest>) {
    try {
        const data: ReturnType<typeof fetchQrCheckApi> extends Promise<infer R> ? R : never =
            yield call(fetchQrCheckApi, action.payload); //payload 사용
        yield put(qrCheckSuccess(data));
    } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? "오류 발생";
        yield put(qrCheckFailure(msg));
    }
}

/* ===================== Watcher ===================== */
export function* serialSaga() {
    yield takeLatest(qrCheckRequest.type, handleQrCheckRequest);
}