import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createJournalAPI,
  fetchJournalsAPI,
  fetchJournalByIdAPI,
  updateJournalAPI,
  deleteJournalAPI,
} from './journalAPI';
import { toast } from 'react-toastify';

export const createJournal = createAsyncThunk('journal/create', async (journalData, thunkAPI) => {
  try {
    const data = await createJournalAPI(journalData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create journal entry';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchJournals = createAsyncThunk('journal/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await fetchJournalsAPI();
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch journal entries';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchJournalById = createAsyncThunk('journal/fetchById', async (id, thunkAPI) => {
  try {
    const data = await fetchJournalByIdAPI(id);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch journal detail';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateJournal = createAsyncThunk('journal/update', async ({ id, journalData }, thunkAPI) => {
  try {
    const data = await updateJournalAPI(id, journalData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update journal entry';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteJournal = createAsyncThunk('journal/delete', async (id, thunkAPI) => {
  try {
    const data = await deleteJournalAPI(id);
    return { id, ...data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete journal entry';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  data: [],
  currentJournal: null,
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchJournalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJournal = action.payload;
      })
      .addCase(fetchJournalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
        toast.success('Journal entry created successfully!');
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJournal = action.payload;
        const index = state.data.findIndex((j) => j._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        toast.success('Journal entry updated successfully!');
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((j) => j._id !== action.payload.id);
        if (state.currentJournal?._id === action.payload.id) {
          state.currentJournal = null;
        }
        toast.success('Journal entry deleted successfully!');
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  }
});

export const { clearCurrentJournal } = journalSlice.actions;
export default journalSlice.reducer;
