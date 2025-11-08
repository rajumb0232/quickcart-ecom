import React from "react";
import { TrendingUp, Clock } from "lucide-react";

const Reports: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-4 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Reports
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Analytics and reports for your store.
                </p>
              </div>
            </div>
          </div>

        </div>
        <div className="w-full max-w-5xl mx-auto">
          <div className=" overflow-hidden">
            <div className="p-8 md:p-10">
              <div className=" rounded-2xl p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>

                <h2 className="text-lg font-semibold text-amber-900 mb-2">
                  Reports are Under Development
                </h2>

                <p className="text-sm text-gray-700 mb-4">
                  You will get this feature delivered soon. We're working hard
                  to bring store analytics to you.
                </p>

                <div className="text-xs text-gray-500">
                  Meanwhile, check back here later — we’ll keep it simple and
                  useful.
                </div>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
};

export default Reports;
