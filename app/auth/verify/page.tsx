"use client";

import { verifyCode } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
    message: "",
    error: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Verifying..." : "Verify Account"}
        </Button>
    );
}

export default function VerifyPage() {
    const [state, formAction] = useFormState(verifyCode, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your email.
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <Input
                                name="code"
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                className="text-center text-3xl tracking-[1em] h-16 w-full max-w-[200px] font-mono uppercase"
                                required
                            />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium">{state.error}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
