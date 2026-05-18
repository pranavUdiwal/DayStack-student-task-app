import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfileAPI, updateProfileAPI, uploadPhotoAPI } from './profileAPI';
import { toast } from 'react-toastify';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, thunkAPI) => {
  try {
    const data = await fetchProfileAPI();
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch profile';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateProfile = createAsyncThunk('profile/update', async (profileData, thunkAPI) => {
  try {
    const data = await updateProfileAPI(profileData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    return thunkAPI.rejectWithValue(message);
  }
});

export const uploadPhoto = createAsyncThunk('profile/uploadPhoto', async (formData, thunkAPI) => {
  try {
    const data = await uploadPhotoAPI(formData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to upload photo';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.profilePhoto = action.payload.profilePhoto;
        }
        toast.success('Profile picture updated successfully!');
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  }
});

export default profileSlice.reducer;
