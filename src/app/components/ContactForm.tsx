"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEmail } from "@/actions/sendEmailAction";

const contactFormSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  email: z.string().email("Nieprawidłowy adres e-mail"),
  subject: z.string().min(1, "Temat jest wymagany"),
  message: z.string().min(3, "Wiadomość jest wymagana"),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmitContactFormMessage = async (data: ContactFormSchema) => {
    try {
      // Format the message with proper HTML
      const formattedHtml = formatMessageToHtml(data.message);

      // Create a nicely formatted HTML email
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Nowa wiadomość kontaktowa</h2>
          <p><strong>Od:</strong> ${data.name} (${data.email})</p>
          <p><strong>Temat:</strong> ${data.subject}</p>
          <div style="margin-top: 20px; border-left: 4px solid #0ea5e9; padding-left: 15px;">
            ${formattedHtml}
          </div>
        </div>
      `;

      await sendEmail({
        from: `"${data.name}" <${data.email}>`,
        subject: data.subject,
        text: data.message,
        html: emailHtml,
      });

      toast.success("Dziękujemy za wiadomość. Wkrótce na nią odpowiemy!");
      form.reset();
    } catch {
      toast.error(
        "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później."
      );
    }
  };

  // Function to format plain text message to HTML preserving formatting
  const formatMessageToHtml = (message: string): string => {
    if (!message) return "";

    // Escape HTML characters to prevent XSS
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const escapedMessage = escapeHtml(message);

    // Replace multiple consecutive line breaks with paragraph tags
    const paragraphs = escapedMessage
      .split(/\n{2,}/)
      .filter((p) => p.trim() !== "")
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

    return paragraphs || `<p>${escapedMessage}</p>`;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitContactFormMessage)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">
                Imię
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:sky-sky-500 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:sky-sky-500 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">
                Temat
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:sky-sky-500 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wiadomość</FormLabel>
              <FormControl>
                <Textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:sky-sky-500 focus:ring-opacity-50"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                           bg-gradient-to-r from-sky-400 to-blue-500
                           hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        >
          Wyślij
        </Button>
      </form>
    </Form>
  );
};
