import { configureStore } from "@reduxjs/toolkit";
import { ApiUtil } from "../service/ApiUtils";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
export const store=configureStore({
    reducer:{
        [ApiUtil.reducerPath]:ApiUtil.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiUtil.middleware),
})
setupListeners(store.dispatch)