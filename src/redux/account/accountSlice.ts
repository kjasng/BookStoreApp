import { createAppSlice } from "@/redux/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AccountSliceState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    };
}

const initialState: AccountSliceState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
    },
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const accountSlice = createAppSlice({
    name: "account",
    initialState,

    // The `reducers` field lets us define reducers and generate associated actions
    reducers: (create) => ({
        doLoginAction: create.reducer(
            (state, action: PayloadAction<AccountSliceState["user"]>) => {
                // Redux Toolkit allows us to write "mutating" logic in reducers. It
                // doesn't actually mutate the state because it uses the Immer library,
                // which detects changes to a "draft state" and produces a brand new
                // immutable state based off those changes
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user = action.payload;
            },
        ),

        doGetAccountAction: create.reducer(
            (
                state,
                action: PayloadAction<{ user: AccountSliceState["user"] }>,
            ) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user = action.payload.user;
            },
        ),

        doLogoutAction: create.reducer((state) => {
            localStorage.removeItem("access_token");
            state.isAuthenticated = false;
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: "",
            };
        }),
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        selectUser: (state: AccountSliceState) => state.user,
        selectIsAuthenticated: (state: AccountSliceState) =>
            state.isAuthenticated,
        selectIsLoading: (state: AccountSliceState) => state.isLoading,
    },
});

// Action creators are generated for each case reducer function.
export const { doLoginAction, doGetAccountAction, doLogoutAction } =
    accountSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
