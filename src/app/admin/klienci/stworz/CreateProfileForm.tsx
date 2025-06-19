"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProfileAction } from "@/actions/profile/createProfileAction";
import z from "zod";
import { InputMask } from "@react-input/mask";

// Profile form schema for validation
export const profileFormSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  surname: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Nieprawidłowy adres e-mail"),
  phone: z.string().min(1, "Numer telefonu jest wymagany"),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export const CreateProfileForm = () => {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
    },
  });

  const handleCreateProfile = async (data: ProfileFormSchema) => {
    try {
      const profileId = await createProfileAction(data);
      toast.success("Profil klienta został utworzony!");
      form.reset();
      return profileId;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Wystąpił błąd podczas tworzenia profilu klienta");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateProfile)}
        className="w-full flex flex-col gap-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwisko</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr telefonu</FormLabel>
              <FormControl>
                <InputMask
                  component={Input}
                  mask="+48 xxx xxx xxx"
                  replacement={{ x: /\d/ }}
                  placeholder="+48 ___ ___ ___"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  type="tel"
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormDescription>Format: +48 XXX XXX XXX</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-6 w-full inline-flex justify-center py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                       bg-gradient-to-r from-sky-400 to-blue-500
                       hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          disabled={form.formState.isSubmitting}
        >
          Utwórz profil klienta
        </Button>
      </form>
    </Form>
  );
};
