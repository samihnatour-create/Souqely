import { getStoreSettings } from "@/lib/actions";
import SettingsForm from "@/components/dashboard/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const store = await getStoreSettings();

  return (
    <div className="grid gap-8 max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 font-bold text-2xl tracking-tight">
          Store Settings
        </h1>
      </div>

      {/* Check if store exists right here */}
      {store ? (
        <SettingsForm store={store} />
      ) : (
        <div className="p-8 border rounded-lg bg-gray-50 text-center">
          <p className="text-gray-600">No store profile found.</p>
          <button className="mt-4 bg-black text-white px-4 py-2 rounded">
            Create Store Profile
          </button>
        </div>
      )}
    </div>
  );
}
