"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  profileFormSchema,
  ProfileFormSchema,
} from "@/app/admin/klienci/stworz/CreateProfileForm";
import { editProfileAction } from "@/actions/profile/editProfileAction";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";

type EditProfileFormProps = {
  profile: Profile;
};

export const EditProfileForm = ({ profile }: EditProfileFormProps) => {
  const router = useRouter();
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      surname: profile.surname,
      email: profile.email,
      phone: profile.phone,
    },
  });

  const handleEditProfile = async (data: ProfileFormSchema) => {
    try {
      await editProfileAction(profile.id, data);
      toast.success("Profil klienta został zaktualizowany!");
      router.refresh();
      router.push("/admin/klienci");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Wystąpił błąd podczas aktualizacji profilu klienta");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditProfile)}
        className="w-full flex flex-col gap-6"
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
                <Input
                  {...field}
                  type="tel"
                  className="border-gray-200 focus:border-sky-400 focus:ring-sky-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full py-3 px-8 border border-transparent shadow-sm rounded-full text-white 
                     bg-gradient-to-r from-sky-400 to-blue-500"
          disabled={form.formState.isSubmitting}
        >
          Zapisz zmiany
        </Button>
      </form>
    </Form>
  );
};
