// Implement your code for product reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "../../utils/utils";

const initialState = {
    products: [],
    filterProduct: [],
    loading: false,
    error: null
}

// get all products
export const fetchProductsAsync = createAsyncThunk('products/getProducts', async (_, { rejectWithValue }) => {
    try {
        const data = await getAllProducts();
        return data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

// products slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        filteredProducts: (state, action) => {

            const { searchQuery, categories, priceRange } = action.payload;
            let filProducts = state.products;

            if (searchQuery) {
                filProducts = filProducts.filter((product) => {
                    return product.title.toLowerCase().includes(searchQuery.toLowerCase());
                })
            }
            if (categories.mensFashion || categories.womensClothing || categories.electronics || categories.jewelery) {
                filProducts = filProducts.filter((product) => {
                    if (categories.mensFashion && product.category === "men's clothing") {
                        return true;
                    }
                    if (categories.womensClothing && product.category === "women's clothing") {
                        return true;
                    }
                    if (categories.electronics && product.category === "electronics") {
                        return true;
                    }
                    if (categories.jewelery && product.category === "jewelery") {
                        return true;
                    }
                    return false;
                })
            }
            if (priceRange) {
                filProducts = filProducts.filter((product) => {
                    return product.price < priceRange;
                });
            }
            state.filterProduct = filProducts;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.filterProduct = action.payload;
            })
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.loading = false;
                console.log("error", action.payload);
                state.error = action.payload;
            })
    }
})


// export product reducer
export const productReducer = productSlice.reducer;

// export product actions
export const productActions = productSlice.actions;

// export product selector
export const productSelector = (state) => state.products;