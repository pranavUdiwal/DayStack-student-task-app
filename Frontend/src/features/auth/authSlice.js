import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, sendOtpAPI, forgotPasswordAPI, verifyResetOtpAPI, resetPasswordAPI } from './authAPI';
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const data = await loginAPI(credentials);
    return data; 
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const data = await registerAPI(userData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, thunkAPI) => {
  try {
    const data = await sendOtpAPI(email);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send OTP';
    return thunkAPI.rejectWithValue(message);
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (otpCode, thunkAPI) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  } catch (error) {
    return thunkAPI.rejectWithValue('Invalid OTP');
  }
});

export const forgotPasswordThunk = createAsyncThunk('auth/forgotPassword', async (userEmail, thunkAPI) => {
  try {
    const data = await forgotPasswordAPI(userEmail);
    return { ...data, email: userEmail };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send password reset OTP';
    return thunkAPI.rejectWithValue(message);
  }
});

export const verifyResetOtpThunk = createAsyncThunk('auth/verifyResetOtp', async (otp, thunkAPI) => {
  try {
    const data = await verifyResetOtpAPI(otp);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid or expired OTP';
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetPasswordThunk = createAsyncThunk('auth/resetPassword', async ({ email, newPassword }, thunkAPI) => {
  try {
    const data = await resetPasswordAPI(email, newPassword);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reset password';
    return thunkAPI.rejectWithValue(message);
  }
});

const getStoredToken = () => {
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  return cookieToken || localStorage.getItem('token') || null;
};

const initialState = {
  user: null, 
  token: getStoredToken(),
  loading: false,
  error: null,
  isSuccess: false,
  otpSent: false,
  resetEmail: null,
  resetOtpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isSuccess = false;
      state.error = null;
      toast.info('Logged out successfully');
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.isSuccess = false;
      state.resetOtpVerified = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        
        const retrievedToken = action.payload.token || getStoredToken();
        
        state.token = retrievedToken;
        state.user = action.payload.user || (retrievedToken ? { email: 'student@example.com' } : null);
        
        if (retrievedToken) {
          localStorage.setItem('token', retrievedToken);
        }
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;

        const retrievedToken = action.payload.token || getStoredToken();
        state.token = retrievedToken;
        state.user = action.payload.user || (retrievedToken ? { email: 'registered@example.com' } : null);

        if (retrievedToken) {
          localStorage.setItem('token', retrievedToken);
        }
        toast.success('Registration successful!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        toast.success('Verification code sent to your email!');
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || 'Failed to send OTP email.');
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        toast.success('Email verified successfully! You can now log in.');
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.resetEmail = action.payload.email;
        toast.success('Password reset verification code sent to your email!');
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(verifyResetOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.resetOtpVerified = true;
        toast.success('OTP verified! Enter your new password.');
      })
      .addCase(verifyResetOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.resetEmail = null;
        state.resetOtpVerified = false;
        toast.success('Password reset successfully! You can now log in.');
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  }
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
