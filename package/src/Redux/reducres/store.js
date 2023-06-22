import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from "redux-thunk";

// persistance state
const reducers = combineReducers({ user: userReducer });
const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store= configureStore({
    reducer: persistedReducer,
    // devTools: process.env.NODE_ENV !== 'production',  
    middleware:[thunk]
});

export default store;