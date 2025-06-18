"use server";

import twilio from "twilio";

type SendSmsParams = {
  to: string;
  message: string;
};

// Create a Twilio client using environment variables
// You'll need to set these in your Vercel environment variables
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

export const sendSms = async (params: SendSmsParams) => {
  const { to, message } = params;

  try {
    if (!twilioClient) {
      throw new Error(
        "Twilio client not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in environment variables"
      );
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error(
        "Twilio phone number not configured. Please set TWILIO_PHONE_NUMBER in environment variables"
      );
    }

    // Format the phone number to international format if it's not already
    // This assumes Polish numbers in the format +48 XXX XXX XXX
    const formattedPhoneNumber = formatPhoneNumber(to);

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
    throw new Error("Failed to send SMS: Unknown error");
  }
};

// Helper function to format phone numbers for Twilio
// Twilio requires E.164 format: +[country code][phone number]
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters except for the + sign
  const cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // If the number already starts with +, return it as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If it's just a local number without country code, add +48 (Poland)
  return `+48${cleaned}`;
}
