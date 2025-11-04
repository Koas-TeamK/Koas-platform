//src/features/serial/serialSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ============= Type =====================
export type SerialData = {
    serial: string;
    itemName: string;
    message: string;
    createdDate: string;
}

// API 요청에 필요한 파라미터 타입 정의
export type QrParams = {
    name: string;
    serial: string;
    token: string;
};

export type SerialState = {
    loading: boolean;
    data: SerialData | null;
    error: string | null;
}

// ============ 초기값 ================
const initialState: SerialState = {
    loading: false,
    data: null,
    error: null
}

// ============== Slice ================
const serialSlice = createSlice({
    name: "serial",
    initialState,
    reducers: {
        //qr check
        qrCheckRequest(state, _action: PayloadAction<QrParams>) {
            state.loading = true;
            state.error = null;
        },
        qrCheckSuccess(state, action: PayloadAction<SerialData>) {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        qrCheckFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }

    }
})

export const {
    qrCheckRequest,
    qrCheckSuccess,
    qrCheckFailure
} = serialSlice.actions;

export default serialSlice.reducer;