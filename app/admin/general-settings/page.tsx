// "use client";

// import { useState } from "react";
// import { Save, RotateCcw } from "lucide-react";

// export default function GeneralSettingsPage() {
//   const defaultSettings = {
//     platformName: "Study Advisor",
//     supportEmail: "support@studyadvisor.com",
//     counselorCapacity: 20,
//     chatbotEnabled: true,
//     autoAssignEnabled: false,
//     brandColor: "#7c3aed",
//   };

//   const [settings, setSettings] = useState(defaultSettings);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;

//     setSettings((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSave = () => {
//     console.log("Saved Settings:", settings);
//     alert("Settings saved successfully!");
//   };

//   const handleReset = () => {
//     setSettings(defaultSettings);
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">General Settings</h1>
//         <p className="text-gray-500 mt-2">
//           Manage platform configuration and preferences.
//         </p>
//       </div>

//       {/* Settings Card */}
//       <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 space-y-8">
//         {/* Platform Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Platform Name
//             </label>
//             <input
//               type="text"
//               name="platformName"
//               value={settings.platformName}
//               onChange={handleChange}
//               className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Support Email
//             </label>
//             <input
//               type="email"
//               name="supportEmail"
//               value={settings.supportEmail}
//               onChange={handleChange}
//               className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Default Counselor Capacity
//             </label>
//             <input
//               type="number"
//               name="counselorCapacity"
//               value={settings.counselorCapacity}
//               onChange={handleChange}
//               className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Brand Color
//             </label>
//             <input
//               type="color"
//               name="brandColor"
//               value={settings.brandColor}
//               onChange={handleChange}
//               className="w-20 h-10 border rounded-lg cursor-pointer"
//             />
//           </div>
//         </div>

//         {/* Toggles */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//             <div>
//               <h3 className="font-medium">Enable Chatbot</h3>
//               <p className="text-sm text-gray-500">
//                 Allow students to use AI chatbot assistance.
//               </p>
//             </div>
//             <input
//               type="checkbox"
//               name="chatbotEnabled"
//               checked={settings.chatbotEnabled}
//               onChange={handleChange}
//               className="w-5 h-5 accent-purple-600"
//             />
//           </div>

//           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//             <div>
//               <h3 className="font-medium">Enable Auto Assignment</h3>
//               <p className="text-sm text-gray-500">
//                 Automatically assign students to counselors.
//               </p>
//             </div>
//             <input
//               type="checkbox"
//               name="autoAssignEnabled"
//               checked={settings.autoAssignEnabled}
//               onChange={handleChange}
//               className="w-5 h-5 accent-purple-600"
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
//           <button
//             onClick={handleReset}
//             className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl border hover:bg-gray-50 transition"
//           >
//             <RotateCcw size={16} />
//             Reset to Default
//           </button>

//           <button
//             onClick={handleSave}
//             className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
//           >
//             <Save size={16} />
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";

export default function GeneralSettingsPage() {
  const defaultSettings = {
    platformName: "Study Advisor",
    supportEmail: "support@studyadvisor.com",
    counselorCapacity: 20,
    chatbotEnabled: true,
    autoAssignEnabled: false,
    brandColor: "#2563eb", // Updated default to matches blue-600
  };

  const [settings, setSettings] = useState(defaultSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8">
        {/* Using brand-heading color */}
        <h1 className="text-3xl font-bold text-brand-heading">General Settings</h1>
        <p className="text-brand-muted mt-2">
          Manage platform configuration and preferences.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 space-y-8">
        {/* Platform Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-brand-heading">
              Platform Name
            </label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              /* focus:ring-brand-primary ensures the focus matches your blue */
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-brand-heading">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-brand-heading">
              Default Counselor Capacity
            </label>
            <input
              type="number"
              name="counselorCapacity"
              value={settings.counselorCapacity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-brand-heading">
              Brand Color
            </label>
            <input
              type="color"
              name="brandColor"
              value={settings.brandColor}
              onChange={handleChange}
              className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <h3 className="font-medium text-brand-heading">Enable Chatbot</h3>
              <p className="text-sm text-brand-muted">
                Allow students to use AI chatbot assistance.
              </p>
            </div>
            <input
              type="checkbox"
              name="chatbotEnabled"
              checked={settings.chatbotEnabled}
              onChange={handleChange}
              /* accent-brand-primary for the checkbox color */
              className="w-5 h-5 accent-brand-primary"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <h3 className="font-medium text-brand-heading">Enable Auto Assignment</h3>
              <p className="text-sm text-brand-muted">
                Automatically assign students to counselors.
              </p>
            </div>
            <input
              type="checkbox"
              name="autoAssignEnabled"
              checked={settings.autoAssignEnabled}
              onChange={handleChange}
              className="w-5 h-5 accent-brand-primary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl border border-gray-300 text-brand-muted hover:bg-gray-50 transition"
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-brand-primary text-white hover:opacity-90 transition shadow-sm"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}