import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Logo />
            </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
