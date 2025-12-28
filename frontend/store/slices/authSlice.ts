import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/lib/types/auth";

const initialState: AuthState = {
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setLoading, setError, clearError } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuthLoading = (state: { auth: AuthState }) =>
    state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
