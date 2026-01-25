import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<
    "customer" | "restaurant" | "admin"
  >("customer");
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login successful!",
        description: "Redirecting...",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);

    try {
      await register({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        role: signupRole,
      });

      toast({
        title: "Account created!",
        description: "Redirecting...",
      });

      if (signupRole === "restaurant") {
        navigate("/restaurant-dashboard");
      } else if (signupRole === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "Unable to create account",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Harsh Anand
          </h1>
          <p className="text-gray-600">Food Delivery</p>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-t-lg">
              <TabsTrigger value="login" className="rounded-tl-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-tr-lg">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your Harsh Anand account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={loginLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={loginLoading}
                    />
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      <strong>Demo Credentials:</strong>
                      <br />
                      Customer: rajesh@example.com / password123
                      <br />
                      Restaurant: priya@anand.com / password123
                      <br />
                      Admin: admin@harshanandfood.com / password123
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loginLoading}
                  >
                    {loginLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join Harsh Anand Food Delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="9876543210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={signupLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-role">Account Type</Label>
                    <select
                      id="signup-role"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as any)}
                      disabled={signupLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="restaurant">Restaurant Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={signupLoading}
                  >
                    {signupLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {signupLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-gray-600 text-sm mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
