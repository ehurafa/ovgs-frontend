import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalesOrderFilters } from "@/features/sales-orders/services/salesOrdersService";

export type SalesOrderFiltersState = SalesOrderFilters;

const initialState: SalesOrderFiltersState = {};

const salesOrderFiltersSlice = createSlice({
  name: "salesOrderFilters",
  initialState,
  reducers: {
    filtersChanged: (state, action: PayloadAction<Partial<SalesOrderFiltersState>>) => {
      Object.assign(state, action.payload);
    },
    filtersCleared: () => initialState,
  },
});

export const { filtersChanged, filtersCleared } = salesOrderFiltersSlice.actions;
export const salesOrderFiltersReducer = salesOrderFiltersSlice.reducer;
