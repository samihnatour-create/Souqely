import { getStoreSettings } from "@/lib/actions";
import SettingsForm from "@/components/dashboard/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const store = await getStoreSettings();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      {/* Pass the store data to the form component */}
      <SettingsForm store={store} />
    </div>
  );
}
