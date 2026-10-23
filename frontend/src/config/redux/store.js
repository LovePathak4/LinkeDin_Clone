import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

/**
 * 
 * STEPS for State Management
 * submit actions
 * handle actions in its reducer
 * register reducer in store
 */

export const store = configureStore({
    reducer: {
        auth:authReducer,
        postReducer:postReducer,
    },
});