"use server";

import { COMPANY_INFO } from "@/consts";
import nodemailer from "nodemailer";

type SendEmailParams = {
  to?: string;
  subject: string;
  text: string;
  html: string;
};
// Make sure your .env variables are properly set
if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
  console.error("Email credentials not found in environment variables");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (params: SendEmailParams) => {
  const { subject, text, html } = params;

  if (process.env.NODE_ENV !== "production") {
    console.info("Email sending in development mode is disabled");
    return {
      success: true,
      message: "Email sending is disabled in development mode",
    };
  }

  try {
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
      throw new Error(
        "Email credentials not configured. Please set SMTP_USERNAME and SMTP_PASSWORD in .env file"
      );
    }

    const info = await transporter.sendMail({
      from: COMPANY_INFO.EMAIL,
      to: params.to || COMPANY_INFO.EMAIL,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    // More descriptive error message that includes the underlying issue
    if (error instanceof Error) {
      // Handle NodeMailer error which has code property
      const mailerError = error as Error & { code?: string };
      if (mailerError.code === "EAUTH") {
        throw new Error(
          "Authentication failed: Please check your email credentials"
        );
      }
      throw new Error(`Failed to send email: ${mailerError.message}`);
    }
    throw new Error("Failed to send email: Unknown error");
  }
};
