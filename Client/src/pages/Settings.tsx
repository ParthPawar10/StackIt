import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UserCircle,
  Lock,
  Bell,
  ShieldCheck,
  Github,
  Mail,
  Trash2,
  Save,
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [username, setUsername] = useState('stackuser123');
  const [password, setPassword] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [emailConnected, setEmailConnected] = useState(true);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSave = () => {
    console.log('Saved settings:', {
      username,
      password,
      emailNotifications,
      pushNotifications,
      twoFAEnabled,
      githubConnected,
      emailConnected,
      profilePicName: profilePic?.name || 'No change',
    });
    // TODO: Send to API
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 text-gray-900 dark:text-white">
      {/* Back Button + Title */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>

      {/* Profile Picture */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <UserCircle className="w-5 h-5 text-gray-700 dark:text-white" />
          Profile Picture
        </h2>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {profilePic && <p className="text-green-600 text-sm">Selected: {profilePic.name}</p>}
      </section>

      {/* Account Info */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Lock className="w-5 h-5 text-gray-700 dark:text-white" />
          Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 rounded border dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full p-2 rounded border dark:bg-gray-800"
            />
          </div>
        </div>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Credentials
        </button>
      </section>

      {/* Connected Accounts */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Mail className="w-5 h-5 text-gray-700 dark:text-white" />
          Connected Accounts
        </h2>
        {[
          {
            label: 'GitHub',
            connected: githubConnected,
            toggle: () => setGithubConnected(!githubConnected),
            Icon: Github,
          },
          {
            label: 'Email',
            connected: emailConnected,
            toggle: () => setEmailConnected(!emailConnected),
            Icon: Mail,
          },
        ].map(({ label, connected, toggle, Icon }) => (
          <div key={label} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-gray-700 dark:text-white" />
              <span>{label}</span>
            </div>
            <button
              onClick={toggle}
              className={`px-4 py-1 rounded text-white ${
                connected
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </section>

      {/* Security */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="w-5 h-5 text-gray-700 dark:text-white" />
          Security
        </h2>
        <div className="flex justify-between items-center">
          <span>Two-Factor Authentication (2FA)</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={twoFAEnabled}
              onChange={() => setTwoFAEnabled(!twoFAEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-checked:bg-green-500 rounded-full peer relative">
              <div className="absolute top-[2px] left-[2px] bg-white border rounded-full h-5 w-5 transition-all peer-checked:translate-x-full"></div>
            </div>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
          Notifications
        </h2>
        {[
          { label: 'Email Notifications', value: emailNotifications, toggle: () => setEmailNotifications(!emailNotifications) },
          { label: 'Push Notifications', value: pushNotifications, toggle: () => setPushNotifications(!pushNotifications) },
        ].map(({ label, value, toggle }) => (
          <div key={label} className="flex justify-between items-center">
            <span>{label}</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={toggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-checked:bg-green-500 rounded-full peer relative">
                <div className="absolute top-[2px] left-[2px] bg-white border rounded-full h-5 w-5 transition-all peer-checked:translate-x-full"></div>
              </div>
            </label>
          </div>
        ))}
      </section>

      {/* Danger Zone */}
      <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-red-600">
          <Trash2 className="w-5 h-5 text-red-600" />
          Danger Zone
        </h2>
        <p className="text-sm text-red-400">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Account
        </button>
      </section>

      {/* Save Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Save className="w-4 h-4 text-white" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
