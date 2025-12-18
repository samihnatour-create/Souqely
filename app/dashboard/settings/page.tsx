import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="grid gap-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Store Settings
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your store details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" type="text" className="w-full" placeholder="My Store" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+961 3 123456" />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t px-6 py-4">
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
