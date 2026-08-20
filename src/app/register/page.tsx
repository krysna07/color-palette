"use client";

import { useState } from "react";
import { Palette, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implementasi Supabase Auth Register disini
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-slate-200">
      <div className="w-full max-w-md my-8">
        
        {/* Main Card */}
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-md mb-5">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm text-center font-medium">
              Join us and start curating your perfect color palettes.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign Up <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex justify-center">
              <button 
                onClick={handleGoogleLogin}
                type="button"
                className="flex justify-center items-center gap-2 w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-bold transition-all shadow-sm hover:shadow"
              >
                <Mail className="w-5 h-5 text-slate-500" />
                <span className="text-[13px]">Continue with Google</span>
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[13px] font-semibold text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-slate-900 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-180" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
