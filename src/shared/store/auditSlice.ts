import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuditEvent } from "@/shared/types";

interface AuditState {
  events: AuditEvent[];
}

const initialState: AuditState = { events: [] };

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    auditEventLogged: (state, action: PayloadAction<AuditEvent>) => {
      state.events.unshift(action.payload);
    },
  },
});

export const { auditEventLogged } = auditSlice.actions;
export const auditReducer = auditSlice.reducer;
