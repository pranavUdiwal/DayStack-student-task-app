import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardAPI } from './dashboardAPI';

export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, thunkAPI) => {
  try {
    const data = await fetchDashboardAPI();
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard statistics';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  data: {
    totalEntries: 0,
    totalStudyHours: 0,
    comparisonVsLastWeek: 0,
    currentWeekDuration: 0,
    weeklyProgress: [
      { day: 'MON', durationMinutes: 0 },
      { day: 'TUE', durationMinutes: 0 },
      { day: 'WED', durationMinutes: 0 },
      { day: 'THU', durationMinutes: 0 },
      { day: 'FRI', durationMinutes: 0 },
      { day: 'SAT', durationMinutes: 0 },
      { day: 'SUN', durationMinutes: 0 }
    ],
    productivityOverview: {
      averageDurationPerEntry: 0
    }
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
