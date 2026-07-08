import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalesOrderStatus } from "@/features/sales-orders/types";

export interface SalesOrderFiltersState {
  status?: SalesOrderStatus;
  customerId?: string;
  transportTypeId?: string;
  date?: string;
}

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
