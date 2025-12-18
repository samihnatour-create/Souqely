import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Start selling online with Souqely today
          </CardDescription>
        </CardHeader>
        <RegisterForm />
      </Card>
    </div>
  );
}
