import { getStoreSettings } from "@/lib/actions";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const store = await getStoreSettings();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 bg-slate-50/50 min-h-screen pb-24 md:pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Store Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile, currency, and payments.</p>
      </div>

      <div className="max-w-3xl">
        <SettingsForm store={store} />
      </div>
    </div>
  );
}