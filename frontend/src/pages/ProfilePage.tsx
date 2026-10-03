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
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove photo (revert to default)
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

  // Save personal details
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      setIsLoading(true);
      const res = await authService.updateProfile({ name, avatar });
      updateUser(res.data.data);
      setSuccessMsg('Personal details saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Change password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await authService.updateProfile({
        currentPassword,
        newPassword,
      });

      setSuccessMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in font-sans">
      {/* Page Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
          Account & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your profile picture, personal information, and password security.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 shadow-sm transition-all duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-center gap-2.5 shadow-sm transition-all duration-200">
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

      {/* 1. Profile Picture Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-200 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-600" />
            Profile Picture
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click your photo or the button to upload a new picture directly from your device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
          {/* Avatar preview */}
          <div
            onClick={handleSelectFileClick}
            className="group relative w-24 h-24 rounded-full bg-slate-100 border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer flex items-center justify-center overflow-hidden shadow-sm transition-all duration-200"
            title="Click to upload a new photo"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
              />
            ) : (
              <User className="w-10 h-10 text-indigo-500" />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200 text-white">
              <Camera className="w-5 h-5 mb-0.5 text-indigo-200" />
              <span className="text-[10px] font-semibold">Change</span>
            </div>

            {/* Loading spinner */}
            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSelectFileClick}
                isLoading={isUploadingPhoto}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                className="shadow-sm transition-all duration-200"
              >
                Upload Photo
              </Button>

              {avatar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                  className="shadow-sm transition-all duration-200"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Supported formats: PNG, JPG, JPEG, WebP (up to 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Personal Details Card (Simple & Clean) */}
      <form onSubmit={handleProfileSubmit}>
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-200 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Personal Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your basic account and contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Read-only</span>
              </div>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="shadow-sm transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>

      {/* 3. Password Security Card (Clean & Simple) */}
      {!isChangingPassword ? (
        // Simple, clean collapsed view
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Password
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage your password and keep your account secure.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setErrorMsg(null);
              setSuccessMsg(null);
              setIsChangingPassword(true);
            }}
            className="shadow-sm transition-all duration-200"
          >
            Change Password
          </Button>
        </div>
      ) : (
        // Simple expanded form with Cancel & Update
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-200 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                Change Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your current password and choose a new one.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="shadow-sm transition-all duration-200"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdatingPassword}
                className="shadow-sm transition-all duration-200"
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
