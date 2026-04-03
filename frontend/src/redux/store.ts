import {configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import appSlice from './slices/appSlice';
import marketplaceSlice from './slices/marketplaceSlice';

const store = configureStore({
  reducer: {
    app: appSlice,
    marketplace: marketplaceSlice,
  },
  middleware: [],
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
