"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import { UPDATE_ABOUT_PROFILE } from "@/graphql/actions/profile/update-profile.action";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Editor from "@/components/Editor";

const formSchema = z.object({
    content: z.string().min(1, {
        message: "Titulo é obrigatório.",
    }),

})

const AboutPage = () => {

    const [updateProfileMutation] = useMutation(UPDATE_ABOUT_PROFILE);
    const { data: profile, refetch: refetchProfile } = useQuery(FETCH_PROFILE);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await updateProfileMutation({ variables: { updateAboutDto: {
            id: profile.fetchProfile.id,
            about: data.content
        } } })
            .then(() => {
                toast.success("About uploaded successfully!");
                form.reset({
                    content: data.content
                });
                refetchProfile();
            });
    }

    useEffect(() => {
        form.reset({
            content: profile?.fetchProfile.about
        });
    }, [form, profile?.fetchProfile]);

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Sobre</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titulo</FormLabel>
                                <FormControl>
                                    <Editor {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" className="w-20 h-10">Salvar</Button>
                </form>
            </Form>
        </div>
    );
}

export default AboutPage;