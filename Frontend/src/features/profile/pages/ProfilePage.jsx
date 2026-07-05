import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, uploadPhoto } from '../profileSlice';
import Navbar from '../../../components/Navbar';
import Loader from '../../../components/Loader';
import { User, Mail, Camera, FileText, CheckCircle2, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      dispatch(updateProfile({ name, bio })).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      dispatch(uploadPhoto(formData));
    }
  };

  const handleDeletePhoto = () => {
    dispatch(updateProfile({ profilePhoto: "" }));
  };

  if (loading && !profile) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <User className="w-8 h-8 text-emerald-600" />
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Customize your digital study card and avatar photo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-5 text-center transition-colors duration-200">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <User className="w-12 h-12" />
                </div>
              )}

              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            {profile?.profilePhoto && (
              <button
                onClick={handleDeletePhoto}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 mt-[-10px] transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Photo
              </button>
            )}

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                {profile?.name || 'Student'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile?.email}
              </p>
            </div>

            {profile?.bio ? (
              <p className="text-sm text-slate-500 dark:text-slate-300 italic bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl leading-relaxed border border-slate-100/50 dark:border-slate-800 w-full">
                "{profile.bio}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800 w-full">
                No bio logged yet. Click edit to define your academic objectives!
              </p>
            )}
          </div>

          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight mb-5 border-b border-slate-50 dark:border-slate-800/60 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Update Account Details
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Student"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Study Philosophy / Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  placeholder="What are your academic focus targets? Tell us about your journey..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all resize-none leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-5 mt-2">
                <button
                  type="submit"
                  disabled={loading || !name}
                  className="bg-slate-900 dark:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer min-w-[120px]"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
