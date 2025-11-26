"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => router.push("/"), 1000);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Toaster position="top-center" />
      <div>
        <div>
          <h2>Welcome Back</h2>
          <p>Sign in to Meta-black Management</p>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label>Password</label>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p>
              Don't have an account?{" "}
              <Link href="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}