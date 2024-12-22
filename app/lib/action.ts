"use server";

import twilio from "twilio";

const client = twilio(process.env.ACCOUNT_SID, process.env.ACCOUNT_TOKEN);
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { formDataType } from "./types";

const prisma = new PrismaClient();

interface twillioCode {
  to: string;
}

export async function createVerificationCheck({ to }: twillioCode) {
  const code = Math.floor(100000 + Math.random() * 900000);
  console.log(code);
  console.log(to);
  if (!to || !code) throw new Error("Please provide your phone number");

  try {
    const message = await client.messages.create({
      body: `Your login OTP is ${code}`,
      from: process.env.PHONE_TWILLIO,
      to: to,
    });

    if (message.status === "queued" || message.status === "sent") {
      // otp saved in db! with expire date !!!! shared in db
      const response = await prisma.otp.create({
        data: {
          otp: Number(code),
          attempt: 0,
          expireAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      if (response) {
        return { id: response.id, success: true, message: "otp has generated" };
      } else {
        throw new Error("Something happened try again");
      }
    }
  } catch (error) {
    console.error(error, "You have a otp error");
  }
}

export async function verifywithdbwithotp(
  id: string,
  code: string,
  user: formDataType,
) {
  // cookies
  if (!id || !code || !user) throw new Error("signin failed ");

  const data = await prisma.otp.findFirst({
    where: {
      id: id,
    },
  });

  try {
    if (data) {
      if (data.otp === Number(code) && data.attempt < 3) {
        //

        const userUpdate = await prisma.user.create({
          data: {
            name: user.name,
            phone: user.phone,
            email: user.email,
            password: user.password,
          },
        });

        console.log(userUpdate);

        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = await new SignJWT({ id: userUpdate.id })
          .setProtectedHeader({
            alg: "HS256",
          })
          .setExpirationTime("30d")
          .sign(JWT_SECRET);

        const cookieStore = await cookies();

        cookieStore.set("paytm", token, {
          maxAge: 2419200,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return {
          status: 200,
          message: "success",
        };
        //
      } else {
        throw new Error("Invalid OTP ");
      }
    }
  } catch (error) {
    console.error(error, "ERROR OCUURED TRY AGAIN");
  }
  //
}
