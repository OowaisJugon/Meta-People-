"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false); // 👈 NEW STATE
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await signUp(email, password, accessCode);

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
          <h2>Create Account</h2>
          <p>Join Meta-black Management</p>

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
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label>Confirm Password</label>
              <div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label>Access Code</label>
              <div>
                <input
                  type={showAccessCode ? "text" : "password"} // 👈 toggle here
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                  placeholder="Enter access code"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessCode(!showAccessCode)}
                >
                  {showAccessCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p>Required to create an account</p>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p>
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}