import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./api/authApi";
import { hotelApi } from "./api/hotelApi";
import { hotelChainApi } from "./api/hotelChainApi";
import { hotelTypeApi } from "./api/hotelTypeApi";
import authSlice from "./slices/authSlice";
import { facilityApi } from "./api/facilityApi";
import { categoryApi } from "./api/categoryApi";
import { bookingApi } from "./api/bookingApi";
import { coreApi } from "./api/coreApi";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        [authApi.reducerPath]: authApi.reducer,
        [hotelApi.reducerPath]: hotelApi.reducer,
        [hotelChainApi.reducerPath]: hotelChainApi.reducer,
        [hotelTypeApi.reducerPath]: hotelTypeApi.reducer,
        [facilityApi.reducerPath]: facilityApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [coreApi.reducerPath]: coreApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    // Ignore these action types from RTK Query
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                ],
            },
        }).concat(
            authApi.middleware,
            hotelApi.middleware,
            hotelChainApi.middleware,
            hotelTypeApi.middleware,
            facilityApi.middleware,
            categoryApi.middleware,
            bookingApi.middleware,
            coreApi.middleware
        ),
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
