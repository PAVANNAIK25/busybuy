// Implement your code for auth reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

// sign In thunk
export const signUpAsync = createAsyncThunk('auth/signUp', async (payload, { rejectWithValue }) => {
    try {
        const { email, password } = payload;
        const data = await createUserWithEmailAndPassword(auth, email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

// sign In thunk
export const signInAsync = createAsyncThunk('auth/signIn', async (payload, { rejectWithValue }) => {
    try {
        const { email, password } = payload;
        const data = await signInWithEmailAndPassword(auth, email, password);
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

// signout async thunk
export const signOutAsync = createAsyncThunk('auth/signOut', (payload, { rejectWithValue }) => {
    try {
        return signOut(auth);
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

const INITIAL_STATE = {
    user: null,
    loading: false,
    error: null
}

// Auth slice to handel all reducer actions 

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        clearError: (state, action) =>{
            state.error = null;
        }
    },
    // reducer actions 
    extraReducers: (builder) => {
        builder
            .addCase(signUpAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(signUpAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(signUpAsync.rejected, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                state.error = action.payload;
            })
            .addCase(signInAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(signInAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(signInAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signOutAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = null;
            })
            .addCase(signOutAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signOutAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

// export auth reducer 
export const authReducer = authSlice.reducer;

// export auth actions
export const authActions = authSlice.actions;

// export auth selector
export const authSelector = (state) => state.auth;