import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import chatSlice from "./slice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist the user field (which includes token)
};

const persistedReducer = persistReducer(persistConfig, chatSlice.reducer);

const store = configureStore({
  reducer: {
    chatStore: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
