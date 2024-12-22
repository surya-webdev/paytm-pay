"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createVerificationCheck, verifywithdbwithotp } from "../lib/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { formDataType } from "../lib/types";

export default function Home() {
  const [isOtp, setIsOtp] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<formDataType>({
    phone: "+916383669850",
    email: "surya@gmail.com",
    name: "surya",
    password: "whay",
  });

  async function handler(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.phone) return;

    const response = await createVerificationCheck({ to: form.phone });
    console.log(response);
    if (response?.success === true) {
      setId(response.id);
      return true;
    } else {
      setError("error");
    }
  }

  async function otpHandler(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    if (id && isOtp) {
      const response = await verifywithdbwithotp(id, isOtp, form);
      console.log(response);
    }
  }

  return (
    <section className="container flex flex-col items-center justify-center gap-4 px-4 py-10">
      {error && <p>{error}</p>}
      <form
        onSubmit={(e) => handler(e)}
        className="flex w-full flex-col items-start justify-start gap-4 md:w-2/4 lg:w-[30%]"
      >
        <Label htmlFor="name">Your Name</Label>
        <Input
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          value={form.name}
          type="text"
          placeholder="Your Name"
        />
        <Label htmlFor="email">Your Email</Label>
        <Input
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          value={form.email}
          type="email"
          placeholder="Email"
        />
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          value={form.phone}
          type=""
          placeholder=" Mobile Number"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          value={form.password}
          type="password"
          placeholder="password"
        />
        <div className="flex w-full items-center justify-between">
          <Button
            className="bg-black text-white"
            type="submit"
            variant="outline"
          >
            Signin
          </Button>
          <div className="justify-self-end">
            <Link className="underline" href="/login">
              Login
            </Link>
          </div>
        </div>
      </form>
      <form className="flex flex-col gap-4" onSubmit={(e) => otpHandler(e)}>
        <InputOTP
          maxLength={6}
          value={isOtp}
          onChange={(isOtp) => setIsOtp(isOtp)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button disabled={isOtp.length < 6} type="submit">
          Submit
        </Button>
      </form>
    </section>
  );
}
