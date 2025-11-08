import { SettingsIcon } from "lucide-react";
import type React from "react";

const Settings: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-4 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <SettingsIcon size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Settings
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Settings for your store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
