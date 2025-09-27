"use client";

import React, { useState } from "react";

// EarlyAccessBookLaunch.tsx
// A single-file React component (Tailwind + Framer Motion) for an Early Access book launch
// - Collects name, email, phone
// - Validates inputs
// - Sends POST to an API endpoint if provided (NEXT_PUBLIC_SUBSCRIBE_API)
// - Falls back to storing submissions in localStorage when no API is configured
// - Includes an example Next.js API route (see comment) you can copy into /pages/api/subscribe.ts

// USAGE
// 1) Add TailwindCSS to your project. (tailwind.config.js + postcss setup)
// 2) Place this file as a component in your Next.js / React app and import it where needed.
// 3) Optionally set NEXT_PUBLIC_SUBSCRIBE_API to a server endpoint that accepts { name, email, phone }
// 4) Or deploy a Next.js api route (example included below) that pushes data to Supabase / Airtable / Google Sheets.

import { motion } from "framer-motion";

type Submission = {
  name: string;
  email: string;
  phone: string;
  created_at?: string;
};

export default function EarlyAccessBookLaunch() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function validatePhone(p: string) {
    // Basic international-friendly check: digits and +, min 7 digits
    const digits = p.replace(/[^0-9]/g, "").length;
    return digits >= 7 && digits <= 15;
  }

 // inside your client component
async function handleSubmit(ev?: React.FormEvent) {
  ev?.preventDefault();
  setError(null);

  if (!name.trim()) return setError("Please enter your name.");
  if (!validateEmail(email)) return setError("Please enter a valid email.");
  if (!validatePhone(phone)) return setError("Please enter a valid phone number.");

  setStatus("sending");
  const payload = { name: name.trim(), email: email.trim(), phone: phone.trim() };

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Server error");

    setStatus("success");
    setName("");
    setEmail("");
    setPhone("");
  } catch (err: any) {
    setStatus("error");
    setError(err?.message || "Something went wrong.");
  }
}


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 p-4">

      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  whileHover={{ scale: 1.02 }}
  className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.25)] transition-shadow duration-500 rounded-2xl p-8 w-full max-w-md border border-gray-100"
>
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 tracking-tight">
  Get Early Access 🚀
</h1>
          <p className="text-center text-gray-600 mb-6 text-[15px] leading-relaxed">Join the exclusive waitlist and be among the first to experience the book launch.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm p-3 outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="Your name" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm p-3 outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="you@example.com" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm p-3 outline-none focus:ring-2 focus:ring-indigo-300 text-black" placeholder="+91 98765 43210" />
            </label>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center gap-3">
              <button
  disabled={status === "sending"}
  type="submit"
  className={`relative inline-flex items-center justify-center px-6 py-3 rounded-xl
              font-semibold text-white
              transition-all duration-300
              shadow-[0_4px_15px_rgba(99,102,241,0.4)]
              hover:shadow-[0_8px_25px_rgba(99,102,241,0.6)]
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
              disabled:opacity-60 disabled:cursor-not-allowed`}
>
  {status === "sending" ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Joining...
    </span>
  ) : (
    "Join Early Access"
  )}
</button>


              <span className="text-sm text-gray-500">No spam. Unsubscribe anytime.</span>
            </div>

            {status === "success" && <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
  className="text-center bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent font-semibold text-lg"
>
  🎉 Thank you for joining! You’ll be notified when the book launches.
</motion.div>}
          </form>
        </motion.div>

        <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  whileHover={{ scale: 1.02 }}
  className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.25)] transition-shadow duration-500 rounded-2xl p-8 w-full max-w-md border border-gray-100"
>

          <div className="h-full flex flex-col justify-center">
            <h2 className="text-2xl font-extrabold text-black">Why join?</h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li>• Early excerpts & sample chapters</li>
              <li>• Exclusive pre-order discount</li>
              <li>• Invite to the virtual launch event</li>
            </ul>

            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-black">Privacy</h3>
              <p className="mt-2 text-sm text-gray-600">We only use your contact to share launch updates. We promise not to spam and misuse the information. We comply with Information Technology Act, 2000.</p>
            </div>

            <div className="mt-6 text-xs text-gray-500">Built with ❤️ — Divjot Singh Arora.</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


/*
Example Next.js API route you can paste into /pages/api/subscribe.ts (TypeScript) — minimal, shows how to forward to Supabase via fetch or store to Google Sheets.

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, phone } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });

  // Option A: Insert to Supabase (recommended)
  // Require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment (service role key kept server-side)
  // const supaRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/early_access`, {
  //   method: 'POST',
  //   headers: {
  //     'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
  //     'Content-Type': 'application/json',
  //     'Prefer': 'return=representation'
  //   },
  //   body: JSON.stringify([{ name, email, phone, created_at: new Date().toISOString() }])
  // });
  // if (!supaRes.ok) return res.status(500).json({ error: 'Supabase error' });

  // Option B: Append to Google Sheet via Apps Script webhook or Airtable via their REST API

  // For demo: store to a simple file (not persistent on serverless) — you should replace with a real DB
  console.log('subscribe:', { name, email, phone });
  return res.status(200).json({ ok: true });
}

*/
