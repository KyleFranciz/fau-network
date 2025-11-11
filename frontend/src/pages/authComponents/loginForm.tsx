"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { useNavigate } from "react-router";

interface LoginFormProps {
  initialMode?: "login" | "signup";
}

// TODO: add a loading state to the form
// TODO: Have it redirect to dashboard after login
export default function LoginForm({ initialMode = "login" }: LoginFormProps) {
  const navigate = useNavigate(); // NOTE: added to help with automatically routing a user to the what route we want
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await signIn(formData.email, formData.password);
      else
        await signUp(
          formData.email,
          formData.password,
          formData.first_name,
          formData.last_name,
        );

      alert("Logged in successfully!"); // TODO: might make into a modal to let the user know (gonna work on in final stretch)
      navigate("/"); // made the change to route the user to the homepage after sign in
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 border rounded-sm space-y-4 bg-white/70"
      >
        <h2 className="text-xl font-semibold text-center">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email address"
          className="w-full border p-2 rounded-lg"
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              placeholder="First Name"
              className="w-full border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              placeholder="Last Name"
              className="w-full border p-2 rounded-lg"
              required
            />
          </>
        )}
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          className="w-full border p-2 rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
        </button>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-center text-gray-500 cursor-pointer"
        >
          {isLogin ? "Need an account? Sign up" : "Already have one? Sign in"}
        </p>
      </form>
    </div>
  );
}
