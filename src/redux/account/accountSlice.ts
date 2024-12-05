import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@/redux/createAppSlice"
import type { AppThunk } from "@/redux/store"
import { fetchCount } from "@/redux/features/counter/counterAPI"

export interface AccountSliceState {
  isAuthenticated: boolean
  user: {
    email: string,
    phone: string,
    fullName: string,
    role: string,
    avatar: string,
    id: string,
  }
}

const initialState: AccountSliceState = {
  isAuthenticated: false,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "guest",
    avatar: "",
    id: "",
  },
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const accountSlice = createAppSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    doLoginAction: create.reducer((state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isAuthenticated = true,
      state.user = action.payload.user
    }),

    doGetAccountAction: create.reducer((state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.isAuthenticated = true,
        state.user = action.payload.user
      }),

    doLogoutAction: create.reducer((state, action) => {
      state.isAuthenticated = false,
      state.user = initialState.user
    }),

  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectCount: counter => counter.value,
    selectStatus: counter => counter.status,
  },
})

// Action creators are generated for each case reducer function.
export const { doLoginAction, doGetAccountAction } =
  accountSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
