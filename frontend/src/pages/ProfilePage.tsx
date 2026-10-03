import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  User,
  Lock,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
  Sparkles,
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Developer 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces' },
  { label: 'Developer 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' },
  { label: 'Developer 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces' },
  { label: 'Developer 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces' },
  { label: 'Developer 5', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces' },
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trigger file selection dialog
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // Upload photo from computer / mobile
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setIsUploadingPhoto(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const formData = new FormData();
      formData.append('avatar', file);

      const res = await authService.uploadAvatar(formData);
      const updated = res.data.data;
      updateUser(updated);
      setAvatar(updated.avatar);
      setSuccessMsg('Profile picture updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to upload profile picture.');
    } finally {
      setIsUploadingPhoto(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Select one of the preset avatars
  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setIsUploadingPhoto(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await authService.updateProfile({ avatar: presetUrl });
      const updated = res.data.data;
      updateUser(updated);
      setAvatar(presetUrl);
      setSuccessMsg('Avatar updated from presets!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update preset avatar.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Remove photo (revert to initials)
  const handleRemovePhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      await authService.updateProfile({ avatar: '' });
      updateUser({ avatar: null });
      setAvatar('');
      setSuccessMsg('Profile picture removed.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to remove picture.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = { name, avatar };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      updateUser(res.data.data);
      setSuccessMsg('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-outfit">
          Account & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload your profile photo, edit personal details, and manage password security.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Profile Photo Management Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-400" />
            Profile Picture
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload an image from your computer or pick from the presets below anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
          {/* Avatar preview with hover upload trigger */}
          <div
            onClick={handleSelectFileClick}
            className="group relative w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500/40 hover:border-indigo-400 cursor-pointer flex items-center justify-center overflow-hidden shadow-glow-sm transition-all"
            title="Click to change photo"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <User className="w-10 h-10 text-indigo-400" />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-slate-200">
              <Camera className="w-5 h-5 mb-0.5 text-indigo-300" />
              <span className="text-[10px] font-semibold">Change</span>
            </div>

            {/* Loading spinner */}
            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSelectFileClick}
                isLoading={isUploadingPhoto}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Upload New Photo
              </Button>

              {avatar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Supported formats: PNG, JPG, JPEG, WebP (max 10MB)
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Or select an avatar preset:
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {PRESET_AVATARS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all hover:scale-105 shrink-0 ${
                  avatar === preset.url
                    ? 'border-indigo-500 shadow-glow-sm ring-2 ring-indigo-500/30'
                    : 'border-slate-800 hover:border-indigo-400'
                }`}
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Personal Information & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Email address cannot be changed.
              </span>
            </div>
          </div>

          <Input
            label="Custom Photo Web URL (Optional)"
            placeholder="https://example.com/your-photo.jpg"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            helperText="You can also paste a direct image URL if hosted externally."
          />
        </div>

        {/* 3. Password Security */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Change Password</h3>
          </div>

          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
