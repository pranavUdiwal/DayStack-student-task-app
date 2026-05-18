import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJournal } from '../../journal/journalSlice';
import Navbar from '../../../components/Navbar';
import { Play, Pause, RotateCcw, Award, CheckCircle, Quote, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TimerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: journalLoading } = useSelector((state) => state.journal);

  const [presetMinutes, setPresetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [showLogModal, setShowLogModal] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logDifficulty, setLogDifficulty] = useState('Medium');
  const [logContent, setLogContent] = useState('');

  const quotes = [
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Deep work is the superpower of the 21st century.", author: "Cal Newport" },
    { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
    { text: "Only one who devotes himself to a cause with his whole strength can be a true master.", author: "Albert Einstein" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
  ];
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const beepRef = useRef(null);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 15000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    let intervalId = null;
    if (isActive && secondsRemaining > 0) {
      intervalId = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleTimerComplete();
    }
    return () => clearInterval(intervalId);
  }, [isActive, secondsRemaining]);

  const [customInput, setCustomInput] = useState('');

  const handlePresetSelect = (mins) => {
    setIsActive(false);
    setPresetMinutes(mins);
    setSecondsRemaining(mins * 60);
    setCustomInput('');
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomInput(value);
    const val = parseInt(value, 10);
    if (!isNaN(val) && val > 0 && val <= 720) {
      setIsActive(false);
      setPresetMinutes(val);
      setSecondsRemaining(val * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(presetMinutes * 60);
  };

  const handleTimerComplete = () => {
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = 520;
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.2);
      } catch (err) {
        console.warn('Audio synthesis failed:', err);
      }
    }
    toast.success("🧠 Fantastic job! Deep work interval completed.");
    setLogTitle(`Deep Work Session (${presetMinutes}m)`);
    setShowLogModal(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logTitle || !logContent) {
      toast.warning('Please enter a title and session notes.');
      return;
    }

    const journalData = {
      title: logTitle,
      content: logContent,
      duration: presetMinutes,
      difficulty: logDifficulty
    };

    const resultAction = await dispatch(createJournal(journalData));
    if (createJournal.fulfilled.match(resultAction)) {
      setShowLogModal(false);
      setLogContent('');
      navigate('/journals');
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((presetMinutes * 60 - secondsRemaining) / (presetMinutes * 60)) * 100;

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden transition-all duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 z-0"></div>
      
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 ${isActive ? 'scale-125 animate-pulse' : 'scale-100'}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 ${isActive ? 'scale-125 animate-pulse' : 'scale-100'}`}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center gap-10">
          <div className="flex justify-between items-center w-full max-w-lg bg-white/5 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-lg gap-4">
            <div className="flex gap-2 items-center flex-wrap">
              {[15, 25, 50, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handlePresetSelect(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    presetMinutes === mins && !customInput
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {mins} Min
                </button>
              ))}

              <div className="flex items-center gap-1 pl-2 ml-1 border-l border-white/20">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={customInput}
                  onChange={handleCustomChange}
                  placeholder="Custom"
                  title="Custom minutes"
                  className={`w-18 bg-white/10 border rounded-xl px-2.5 py-1.5 text-xs text-center text-white focus:outline-none transition-all placeholder:text-slate-400 ${customInput ? 'border-emerald-500 bg-emerald-950/30 font-bold' : 'border-white/20'}`}
                />
                <span className="text-xs text-slate-400 font-bold">m</span>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 shrink-0"
              title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
            </button>
          </div>

          <div className="relative w-80 h-80 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="135"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="160"
                cy="160"
                r="135"
                className="stroke-emerald-600 transition-all duration-300"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 135}
                strokeDashoffset={2 * Math.PI * 135 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-6xl font-black font-mono tracking-tighter tabular-nums drop-shadow">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                {isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Deep Focus Mode
                  </>
                ) : (
                  'Interval Paused'
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={resetTimer}
              className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md hover:scale-105"
              title="Reset timer"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={toggleTimer}
              className={`p-6 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isActive ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
            </button>

            <button
              onClick={handleTimerComplete}
              className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md hover:scale-105"
              title="Complete session early"
            >
              <CheckCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-md w-full text-center px-6 min-h-[70px] flex flex-col justify-center">
            <p className="text-sm italic text-slate-300 leading-relaxed flex items-center justify-center gap-1.5">
              <Quote className="w-4 h-4 text-emerald-500 shrink-0 inline transform -scale-y-100" />
              "{quotes[currentQuoteIdx].text}"
            </p>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">— {quotes[currentQuoteIdx].author}</span>
          </div>
        </main>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950 p-3 rounded-2xl border border-emerald-800">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Log Deep Work</h3>
                <p className="text-xs text-slate-400">Save this completed session as a journal entry.</p>
              </div>
            </div>

            <form onSubmit={handleLogSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Topic / Subject Name
                </label>
                <input
                  type="text"
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  required
                  placeholder="e.g. Organic Chemistry Review"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Difficulty Level
                </label>
                <select
                  value={logDifficulty}
                  onChange={(e) => setLogDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-white transition-all cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Learning Notes / Accomplishments
                </label>
                <textarea
                  value={logContent}
                  onChange={(e) => setLogContent(e.target.value)}
                  required
                  rows="4"
                  placeholder="What concepts did you review? List key takeaways or formulas here..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-white transition-all resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end border-t border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={journalLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer min-w-[100px]"
                >
                  {journalLoading ? 'Saving...' : 'Save & Close'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
