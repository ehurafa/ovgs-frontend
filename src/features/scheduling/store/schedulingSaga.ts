import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { schedulingService } from "@/features/scheduling/services/schedulingService";
import {
  confirmSchedulingRequested,
  confirmSchedulingSucceeded,
  confirmSchedulingFailed,
} from "./schedulingSlice";
import { auditEventLogged } from "@/shared/store/auditSlice";
import { queryClient } from "@/lib/query/queryClient";
import { salesOrderKeys } from "@/features/sales-orders/services/queryKeys";
import type { SchedulingInput } from "@/features/scheduling/schemas";
import type { SalesOrder } from "@/features/sales-orders/types";

function* confirmSchedulingWorker(
  action: PayloadAction<{ orderId: string; input: SchedulingInput }>
) {
  const { orderId, input } = action.payload;

  try {
    const updatedOrder: SalesOrder = yield call(schedulingService.confirm, orderId, input);

    yield put(
      auditEventLogged({
        id: `audit-${Date.now()}`,
        entity: "Scheduling",
        entityId: orderId,
        action: "SCHEDULING_CHANGED",
        occurredAt: new Date().toISOString(),
        newState: updatedOrder.scheduling,
      })
    );

    queryClient.setQueryData(salesOrderKeys.detail(orderId), updatedOrder);
    yield call(() => queryClient.invalidateQueries({ queryKey: salesOrderKeys.lists() }));

    yield put(confirmSchedulingSucceeded());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to confirm scheduling";
    yield put(confirmSchedulingFailed(message));
  }
}

export function* schedulingSaga() {
  yield takeLatest(confirmSchedulingRequested.type, confirmSchedulingWorker);
}
