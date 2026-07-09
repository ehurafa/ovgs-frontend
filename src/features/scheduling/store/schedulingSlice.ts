import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SchedulingInput } from "@/features/scheduling/schemas";

interface SchedulingState {
  orderId: string | null;
  status: "idle" | "confirming" | "confirmed" | "error";
  error: string | null;
}

const initialState: SchedulingState = {
  orderId: null,
  status: "idle",
  error: null,
};

const schedulingSlice = createSlice({
  name: "scheduling",
  initialState,
  reducers: {
    confirmSchedulingRequested: (
      state,
      action: PayloadAction<{ orderId: string; input: SchedulingInput }>
    ) => {
      state.orderId = action.payload.orderId;
      state.status = "confirming";
      state.error = null;
    },
    confirmSchedulingSucceeded: (state) => {
      state.status = "confirmed";
    },
    confirmSchedulingFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const { confirmSchedulingRequested, confirmSchedulingSucceeded, confirmSchedulingFailed } =
  schedulingSlice.actions;
export const schedulingReducer = schedulingSlice.reducer;
