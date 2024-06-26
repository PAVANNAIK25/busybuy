import { getDefaultMiddleware } from '@reduxjs/toolkit';

export const customMiddleware = getDefaultMiddleware({
    serializableCheck: false
})