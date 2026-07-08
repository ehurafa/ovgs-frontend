import { combineReducers } from "@reduxjs/toolkit";
import { salesOrderFiltersReducer } from "@/features/sales-orders/store/salesOrderFiltersSlice";
import { schedulingReducer } from "@/features/scheduling/store/schedulingSlice";
import { auditReducer } from "@/shared/store/auditSlice";

export const rootReducer = combineReducers({
  salesOrderFilters: salesOrderFiltersReducer,
  scheduling: schedulingReducer,
  audit: auditReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
