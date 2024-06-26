// Implement your code for cart reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDoc, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { clearCartAndRedirect, getProductsUsingProductIds, getUserCartProducts } from "../../utils/utils";
import { toast } from "react-toastify";
import { db } from "../../config/firebase";

const INITIAL_STATE = {
    cart: [],
    cartMap: {},
    loading: false,
    error: null
}

export const addToCartAsync = createAsyncThunk('cart/addToCart', async (payload, { rejectWithValue, dispatch }) => {
    try {
        const { productId, user } = payload;
        //getting user cart info
        const { data, docRef } = await getUserCartProducts(user);
        //if user cart already exists
        if (data && data.myCart[productId]) {
            const { myCart: cart } = data;
            const currentProductCount = cart[productId];
            const updatedCart = {
                ...cart,
                [productId]: currentProductCount + 1
            }
            await updateDoc(docRef, {
                myCart: updatedCart
            })

            toast.success("Product count increased!");
            return productId;
        }
        // creating new cart
        if(data.myCart){

            const cart = data?.myCart || {}; // 
            await setDoc(docRef, {
                myCart: { ...cart, [productId]: 1 }
            });
            return toast.success("Product Added Successfully!");
        }
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

// decrease Quantity
export const decreaseQuantityAsync = createAsyncThunk('cart/updateQuantity',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const { productId, user } = payload;
            //getting user cart info
            const { data, docRef } = await getUserCartProducts(user);
            //if user cart already exists
            if (data && data.myCart[productId]) { 
                const { myCart: cart } = data;
                const currentProductCount = cart[productId];
                let updatedCart;
                let message = "";
                if (currentProductCount <= 1) {
                    delete cart[productId];
                    updatedCart = {
                        ...cart
                    }
                    message = "Product removed from cart!";
                } else {
                    updatedCart = {
                        ...cart,
                        [productId]: currentProductCount - 1
                    }
                    message = "Product count decreased!";
                }
                await updateDoc(docRef, {
                    myCart: updatedCart
                })

                toast.success(message);
                return productId;
            }
        }
        catch (error) {
            return rejectWithValue(error.message);
        }

    }
)

// get cart products
export const getUserProductsAsync = createAsyncThunk('cart/getCartProducts',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await getUserCartProducts(payload);
            const productsData = await getProductsUsingProductIds(data.myCart);
            return {myCart: data.myCart, productsData};
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
)

// Remove products
export const removeProductAsync = createAsyncThunk('cart/removeFromCart',
    async (payload, { rejectWithValue }) => {
        const { productId, user } = payload;
        try {
            const { data, docRef } = await getUserCartProducts(user);
            const { myCart: cart } = data;

            if (!cart[productId]) {
                return toast.error("Product not in cart!");
            }

            delete cart[productId];
            await updateDoc(docRef, {
                myCart: {
                    ...cart
                },
            });
            return productId;

        } catch (error) {
            rejectWithValue(error.message);
        }

    }
)

export const purchaseFromCartAsync = createAsyncThunk('cart/purchase',
    async (payload, { rejectWithValue }) => {
        const { user, cartMap } = payload;
        try {
            const docRef = doc(db, "userOrders", user.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            
            //users orders exists

            if (data) {
                await updateDoc(docRef, {
                    orders: arrayUnion({ ...cartMap, date: Date.now() }),
                });
                clearCartAndRedirect(user);
                return;
            }
            // first order of user
            await setDoc(docRef, {
                orders: [{...cartMap, Date: Date.now()}],
            });
            clearCartAndRedirect(user);
            return;
        } catch (error) {
            rejectWithValue(error.message);
        }
    }
)


//creating cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState: INITIAL_STATE,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (!Array.isArray(state.cart)) {
                    state.cart = [];
                }
                const index = state.cart?.findIndex((i) => i.id === action.payload);
                if (index >= 0) {
                    state.cart.at(index).quantity++;
                } else {
                    state.cart.push({ ...action.payload, quantity: 1 });
                }
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserProductsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload?.productsData;
                state.cartMap = action.payload?.myCart;
            })
            .addCase(getUserProductsAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getUserProductsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeProductAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = state.cart.filter((i) => i.id !== action.payload);

            })
            .addCase(removeProductAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(removeProductAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(decreaseQuantityAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(decreaseQuantityAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cart.findIndex((i) => i.id === action.payload);
                if (index >= 0) {
                    state.cart[index].quantity--;
                    if (state.cart[index].quantity === 0) {
                        state.cart.splice(index, 1);
                    }
                }
            })
            .addCase(decreaseQuantityAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(purchaseFromCartAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(purchaseFromCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = [];
            })
            .addCase(purchaseFromCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

// export cart reducer 
export const cartReducer = cartSlice.reducer;

// export cart actions 
export const cartActions = cartSlice.actions;

// export cart selector 
export const cartSelector = (state) => state.cart;


