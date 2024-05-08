"use client";

import { logoutUser } from "@/actions/logout";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UPDATE_USER } from "@/graphql/actions/user/update-user.action";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nome é obrigatório.",
    }),
    images: z.object({ url: z.string() }).array().min(1, { message: "Imagem é obrigatória." }),
  });

const ProfileClient = () => {
    const user = useCurrentUser();
    const router = useRouter();
    const [updateUserMutation] = useMutation(UPDATE_USER);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          name: '',
          images: [],
      },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
      const formData = {
        name: data.name,
        imageUrl: data.images[0].url
    };
  
    updateUserMutation({
      variables: {
          userDto: formData
      }
    }).then(() => {
        toast.success("User updated successfully!");
    })
    }

    const handleLogout = async () => {
        try {
            toast.success('Saindo...');
            await signOut();
        } catch (error) {
            toast.error('Erro');
        }
    };

    useEffect(() => {
        if (user?.id) {
            form.reset({
                name: user.name || '',
                images: user.image ? [{url: user?.image}] : []
            });
        }
    }, [form, user]);

    if (!user) {
        return null;
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Perfil</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Foto de Perfil</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map(image => image.url)}
                                        // disabled={loading}
                                        onChange={(url) => field.onChange([{ url }])}
                                        onRemove={() => field.onChange([])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input className="bg-foreground/5 h-14" placeholder="Desenvolvedor de software..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-20 h-10">Salvar</Button>
                </form>
            </Form>

            <div className="flex w-full justify-end">
            <Button className="mt-12" onClick={handleLogout}>Sair da conta</Button>
            </div>
        </div>
    );
};

export default ProfileClient;