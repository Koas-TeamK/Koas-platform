// src/features/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

type UiState = {
    snsOpen: boolean;
};

const initialState: UiState = {
    snsOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSns(state) {
            state.snsOpen = !state.snsOpen;
        },
        closeSns(state) {
            state.snsOpen = false;
        },
        openSns(state) {
            state.snsOpen = true;
        },
    },
});

export const { toggleSns, closeSns, openSns } = uiSlice.actions;
export default uiSlice.reducer;
