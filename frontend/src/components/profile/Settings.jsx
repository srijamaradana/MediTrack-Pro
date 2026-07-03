import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Globe, Lock, Save } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Settings</h2>
      <div className="card space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-gray-500" /> Notifications</div>
          <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)}
            className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2"><Moon className="w-5 h-5 text-gray-500" /> Dark Mode</div>
          <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)}
            className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-gray-500" /> Language</div>
          <select className="input w-32 py-1"><option>English</option><option>Hindi</option></select>
        </div>
        <button className="btn-primary w-full"><Save className="w-4 h-4" /> Save Settings</button>
      </div>
    </div>
  );
};
export default Settings;