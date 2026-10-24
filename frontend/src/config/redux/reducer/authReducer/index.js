import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests } from "../../action/authAction";

const initialState = {
    user: undefined,
    isError: false,
    isLoading: false,
    isSuccess: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        emptyMessage: (state) => { state.message = ""; },
        setTokenIsThere: (state) => { state.isTokenThere = true; },
        setTokenIsNotThere: (state) => { state.isTokenThere = false; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Logging in...";
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "Login Successful";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering...";
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = "Registration successful! Please sign in.";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Registration failed";
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.profileFetched = true;
                state.user = action.payload;
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.profileFetched = false;
                state.message = action.payload?.message || "Could not load profile";
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.all_profiles_fetched = true;
                state.all_users = action.payload.profiles;
            })
            .addCase(getConnectionsRequest.fulfilled, (state, action) => {
                state.connections = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })

            // .addCase(getConnectionsRequest.fulfilled, (state, action) => {
            //     state.connections = action.payload;
            // })
            .addCase(getConnectionsRequest.rejected, (state, action) => {
                state.message = action.payload;
            })
            // .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
            //     state.connectionRequest = action.payload;
            // })
            .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
                state.connectionRequest = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(getMyConnectionRequests.rejected, (state, action) => {
                state.message = action.payload;
            });
    }
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;