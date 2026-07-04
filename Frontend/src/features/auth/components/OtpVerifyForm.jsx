import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';

export default function OtpVerifyForm({ email }) {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6 && email) {
      const resultAction = await dispatch(verifyOtp(otpCode));
      if (verifyOtp.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
      <div className="flex gap-2 sm:gap-3 justify-center w-full">
        {otp.map((data, index) => {
          return (
            <input
              className="w-10 h-12 sm:w-12 sm:h-14 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-center rounded-lg text-lg font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              ref={el => inputRefs.current[index] = el}
            />
          );
        })}
      </div>

      <button
        type="submit"
        disabled={loading || otp.join('').length < 6}
        className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center cursor-pointer"
      >
        {loading ? <Loader inline /> : 'Verify Account'}
      </button>
    </form>
  );
}
