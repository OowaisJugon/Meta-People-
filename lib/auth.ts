// lib/auth.ts
import { supabase } from "./supabase";

export async function signIn(email: string, password: string) {
  try {
    // Check if credentials exist in allowedpeople table
    const { data, error } = await supabase
      .from("allowedpeople")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      return { success: false, message: "Invalid credentials" };
    }

    // Store session in localStorage
    localStorage.setItem("userSession", JSON.stringify({ email, loggedIn: true }));
    return { success: true, message: "Login successful" };
  } catch (error) {
    return { success: false, message: "An error occurred during login" };
  }
}

export async function signUp(email: string, password: string, accessCode: string) {
  try {
    // Verify access code
    if (accessCode !== "metabox123") {
      return { success: false, message: "Invalid access code" };
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from("allowedpeople")
      .select("email")
      .eq("email", email)
      .single();

    if (existing) {
      return { success: false, message: "Email already registered" };
    }

    // Insert new user
    const { error } = await supabase
      .from("allowedpeople")
      .insert({ email, password });

    if (error) {
      return { success: false, message: `Registration failed: ${error.message}` };
    }

    // Auto-login after signup
    localStorage.setItem("userSession", JSON.stringify({ email, loggedIn: true }));
    return { success: true, message: "Registration successful" };
  } catch (error) {
    return { success: false, message: "An error occurred during registration" };
  }
}

export function signOut() {
  localStorage.removeItem("userSession");
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const session = localStorage.getItem("userSession");
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    return parsed.loggedIn === true;
  } catch {
    return false;
  }
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("userSession");
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}