import { createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';

type Metrics = { metrics: string[] };

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: <Array<any>>[],
};

const metricSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state: { metrics: any[]; }, action: PayloadAction<Metrics>): void => {
      state.metrics.push(action.payload);
    },
    metricsApiErrorReceived: (state: any, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = metricSlice.reducer;
export const actions = metricSlice.actions;
