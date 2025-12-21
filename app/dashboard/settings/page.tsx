import { getStoreSettings } from "@/lib/actions";
import SettingsForm from "@/components/dashboard/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const store = await getStoreSettings();

  if (!store) {
    redirect("/auth/login");
  }

  return (
    <div className="grid gap-8 max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-bold tracking-tight sm:grow-0">
          Store Settings
        </h1>
      </div>
      
      <SettingsForm store={store} />
    </div>
  );
}
